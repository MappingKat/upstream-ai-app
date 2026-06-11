'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useConnectivity } from '@/lib/useConnectivity';
import { district } from '@/data/district';

export function TopBar() {
  const { mode } = useApp();
  const { status, queuedCount, lastSyncLabel, retrySync } = useConnectivity();
  const [clock, setClock] = useState('');

  useEffect(() => {
    const update = () => setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, []);

  const syncConfig: Record<string, { label: string; classes: string; animation?: string }> = {
    online: {
      label: 'Synced',
      classes: 'bg-green-bg text-green border-green-border',
    },
    offline: {
      label: 'Working offline',
      classes: 'bg-yellow-bg text-yellow border-yellow-border',
    },
    stale: {
      label: 'Offline 6h+',
      classes: 'bg-red-bg text-red border-red-border',
      animation: 'sync-warn 2.5s ease-in-out infinite',
    },
  };

  const sync = syncConfig[status];
  const modeLabel = mode === 'all' ? 'All systems' : mode === 'dw' ? 'Drinking water' : 'Wastewater';
  const modeDotColor = mode === 'all'
    ? 'bg-gradient-to-br from-[#2563eb] to-[#16a34a]'
    : mode === 'dw' ? 'bg-[#2563eb]' : 'bg-[#16a34a]';

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-surface border-b border-border px-[22px] h-14 flex items-center justify-between shrink-0 gap-3">
      <div className="text-base text-text-dim flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
        {dateStr} · {district.name}
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Sync Status */}
        <button
          onClick={retrySync}
          className={`flex items-center gap-1.5 px-[11px] py-[5px] rounded-[14px] text-[10px] font-bold uppercase tracking-[0.6px] border cursor-pointer ${sync.classes}`}
          style={status === 'stale' ? { animation: sync.animation } : undefined}
          title={status === 'online' ? 'Connected — click to re-check' : 'Click to retry connection'}
        >
          <span
            className="w-[7px] h-[7px] rounded-full bg-current shrink-0"
            style={status === 'online' ? { animation: 'pulse-dot 2s infinite' } : undefined}
          />
          <span>{sync.label}</span>
          {lastSyncLabel && status !== 'online' && (
            <span className="font-mono font-semibold normal-case tracking-normal opacity-85 ml-0.5">
              · {lastSyncLabel}
            </span>
          )}
          {queuedCount > 0 && (
            <span className="bg-current text-white rounded-[9px] px-1.5 py-px font-mono text-[9px] font-bold ml-1">
              {queuedCount} queued
            </span>
          )}
          {status !== 'online' && (
            <span className="bg-white/60 text-current border-none text-[9px] font-bold px-[7px] py-[2px] rounded-[9px] uppercase tracking-[0.5px] ml-1">
              Retry
            </span>
          )}
        </button>

        {/* Mode Indicator */}
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-bg rounded-[14px] border border-border text-[10px] font-semibold text-text-mid uppercase tracking-[0.6px] mr-2.5">
          <span className={`w-1.5 h-1.5 rounded-full ${modeDotColor}`} />
          {modeLabel}
        </span>

        {/* Clock */}
        <span className="font-mono text-xs text-text-mid bg-bg px-2.5 py-[5px] rounded-[6px] border border-border">
          {clock || '--:--'}
        </span>
      </div>
    </div>
  );
}
