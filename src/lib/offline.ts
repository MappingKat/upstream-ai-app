/**
 * Offline sync queue and connectivity detection.
 * Stores pending actions in localStorage when offline, replays them when back online.
 */

const QUEUE_KEY = 'upstream_sync_queue';
const LAST_SYNC_KEY = 'upstream_last_sync';

export interface QueuedAction {
  id: string;
  type: string;         // e.g. 'save_log', 'save_sample', 'resolve_gap'
  payload: unknown;
  createdAt: number;
}

// ── Queue management ──

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getQueue(): QueuedAction[] {
  if (!hasStorage()) return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: QueuedAction[]): void {
  if (!hasStorage()) return;
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function enqueue(type: string, payload: unknown): QueuedAction {
  const action: QueuedAction = {
    id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    payload,
    createdAt: Date.now(),
  };
  const queue = getQueue();
  queue.push(action);
  saveQueue(queue);
  return action;
}

export function dequeue(id: string): void {
  const queue = getQueue().filter(a => a.id !== id);
  saveQueue(queue);
}

export function clearQueue(): void {
  if (!hasStorage()) return;
  localStorage.removeItem(QUEUE_KEY);
}

// ── Last sync tracking ──

export function getLastSync(): number | null {
  if (!hasStorage()) return null;
  const raw = localStorage.getItem(LAST_SYNC_KEY);
  return raw ? parseInt(raw, 10) : null;
}

export function setLastSync(timestamp?: number): void {
  if (!hasStorage()) return;
  localStorage.setItem(LAST_SYNC_KEY, String(timestamp ?? Date.now()));
}

export function getTimeSinceSync(): string | null {
  const last = getLastSync();
  if (!last) return null;
  const diff = Date.now() - last;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── Connectivity detection ──

export function isOnline(): boolean {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
}

/**
 * Heartbeat check — tries to reach the app's own server.
 * More reliable than navigator.onLine which only checks network adapter.
 */
export async function checkConnectivity(): Promise<boolean> {
  try {
    const res = await fetch('/api/health', {
      method: 'HEAD',
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Replay queued actions when back online.
 * Calls the provided handler for each action; removes successfully processed ones.
 */
export async function replayQueue(
  handler: (action: QueuedAction) => Promise<boolean>
): Promise<{ succeeded: number; failed: number }> {
  const queue = getQueue();
  let succeeded = 0;
  let failed = 0;

  for (const action of queue) {
    try {
      const ok = await handler(action);
      if (ok) {
        dequeue(action.id);
        succeeded++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  if (succeeded > 0) {
    setLastSync();
  }

  return { succeeded, failed };
}
