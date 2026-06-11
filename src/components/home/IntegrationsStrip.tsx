'use client';

import Link from 'next/link';
import { integrations } from '@/data/integrations';

export function IntegrationsStrip() {
  const warnCount = integrations.filter(i => i.status === 'warn').length;
  const healthyCount = integrations.filter(i => i.status === 'healthy').length;
  const downCount = integrations.filter(i => i.status === 'down').length;

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden mb-3.5">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex justify-between items-center flex-wrap gap-2 bg-gradient-to-b from-[#fafbfc] to-white">
        <div className="text-sm font-bold text-navy uppercase tracking-[0.8px] flex items-center gap-2">
          🔌 Live data &amp; integrations
          <span className={`inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-[14px] text-[10px] font-bold uppercase tracking-[0.5px] ${
            warnCount > 0 ? 'bg-yellow-bg text-yellow' : 'bg-green-bg text-green'
          }`}>
            {warnCount > 0 ? `⚠ ${warnCount} needs attention` : '✓ All healthy'}
          </span>
        </div>
        <div className="text-[10px] text-text-dim font-mono">
          {integrations.length} systems · last health check 07:34 AM
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
        {integrations.map((integ, idx) => {
          const dotColor = integ.status === 'healthy' ? 'bg-green' : integ.status === 'warn' ? 'bg-yellow' : 'bg-red';
          const textClass = integ.status === 'warn' ? 'text-yellow' : integ.status === 'down' ? 'text-red' : '';

          return (
            <div
              key={integ.name}
              className={`px-3.5 py-3 border-r border-border last:border-r-0 max-[900px]:border-b max-[900px]:even:border-r-0 ${
                idx === integrations.length - 1 ? 'border-r-0' : ''
              }`}
            >
              <div className="flex items-center gap-1.5 mb-[5px]">
                <span className={`w-2 h-2 rounded-full shrink-0 relative ${dotColor}`}>
                  {integ.status === 'healthy' && (
                    <span
                      className="absolute -inset-0.5 rounded-full bg-green/25"
                      style={{ animation: 'pulse-ring 2s ease-in-out infinite' }}
                    />
                  )}
                </span>
                <span className="text-[11px] font-bold text-navy">{integ.name}</span>
              </div>
              <div className={`text-[10px] font-mono ${textClass || 'text-text-mid'}`}>
                {integ.statusText}
              </div>
              <div className="text-[9px] text-text-dim mt-[5px] font-mono leading-relaxed">
                {integ.meta.map((m, i) => (
                  <span key={i}>{m}{i < integ.meta.length - 1 && <br />}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-bg border-t border-border flex justify-between items-center text-[10px] text-text-mid font-mono">
        <span>{warnCount} system slow · {healthyCount} healthy · {downCount} down</span>
        <Link
          href="/integrations"
          className="text-accent font-semibold no-underline hover:underline text-[10px]"
        >
          View all integrations &amp; manage →
        </Link>
      </div>
    </div>
  );
}
