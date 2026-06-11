'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getQueue, getTimeSinceSync, setLastSync, checkConnectivity } from './offline';

export type ConnectivityStatus = 'online' | 'offline' | 'stale';

interface ConnectivityState {
  status: ConnectivityStatus;
  queuedCount: number;
  lastSyncLabel: string | null;
  retrySync: () => void;
}

const HEARTBEAT_INTERVAL = 30_000; // 30 seconds
const STALE_THRESHOLD = 6 * 60 * 60 * 1000; // 6 hours

export function useConnectivity(): ConnectivityState {
  const [status, setStatus] = useState<ConnectivityStatus>('online');
  const [queuedCount, setQueuedCount] = useState(0);
  const [lastSyncLabel, setLastSyncLabel] = useState<string | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const updateState = useCallback(() => {
    const queue = getQueue();
    setQueuedCount(queue.length);
    setLastSyncLabel(getTimeSinceSync());
  }, []);

  const checkStatus = useCallback(async () => {
    if (!navigator.onLine) {
      setStatus('offline');
      updateState();
      return;
    }

    const reachable = await checkConnectivity();
    if (reachable) {
      setStatus('online');
      setLastSync();
    } else {
      // Navigator says online but can't reach server
      const timeSinceSync = getTimeSinceSync();
      if (timeSinceSync && timeSinceSync.includes('h') && parseInt(timeSinceSync) >= 6) {
        setStatus('stale');
      } else {
        setStatus('offline');
      }
    }
    updateState();
  }, [updateState]);

  const retrySync = useCallback(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    // Initial check
    checkStatus();

    // Listen for online/offline events
    const handleOnline = () => checkStatus();
    const handleOffline = () => {
      setStatus('offline');
      updateState();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic heartbeat
    heartbeatRef.current = setInterval(checkStatus, HEARTBEAT_INTERVAL);

    // Update queue count periodically
    const queueInterval = setInterval(updateState, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      clearInterval(queueInterval);
    };
  }, [checkStatus, updateState]);

  return { status, queuedCount, lastSyncLabel, retrySync };
}
