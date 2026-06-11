'use client';

import { trendStats } from '@/data/home';
import { ModeVisible } from '@/components/ui/ModeVisible';

function TrendStatCard({ stat }: { stat: typeof trendStats[number] }) {
  const deltaClass =
    stat.delta.direction === 'up' ? 'bg-green-bg text-green'
    : stat.delta.direction === 'down' ? 'bg-red-bg text-red'
    : 'bg-bg text-text-dim';

  return (
    <div className="bg-surface border border-border rounded-[10px] p-3.5 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[10px]"
        style={{ background: stat.accentColor }}
      />
      <div className="text-[10px] font-bold text-text-dim uppercase tracking-[1px] mt-[7px] mb-[5px]">
        {stat.label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[26px] font-bold text-navy font-mono tracking-tight leading-none">
          {stat.value}
        </span>
        <span className="text-[11px] text-text-mid font-mono">{stat.unit}</span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${deltaClass}`}>
          {stat.delta.value}
        </span>
      </div>
      <div className="text-[10px] text-text-mid mt-[5px] leading-relaxed">{stat.note}</div>
    </div>
  );
}

export function TrendsStrip() {
  return (
    <div className="grid grid-cols-4 gap-2.5 mb-3.5 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
      {trendStats.map((stat) => {
        const card = <TrendStatCard key={stat.label} stat={stat} />;
        if (stat.modeVisibility) {
          return <ModeVisible key={stat.label} show={stat.modeVisibility}>{card}</ModeVisible>;
        }
        return card;
      })}
    </div>
  );
}
