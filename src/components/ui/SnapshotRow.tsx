'use client';

import { ModeVisible } from './ModeVisible';
import type { SnapshotRow as SnapshotRowType } from '@/lib/types';

function SnapshotRowInner({ label, value, status }: Omit<SnapshotRowType, 'modeVisibility'>) {
  const valueColor = status === 'ok' ? 'text-green' : status === 'warn' ? 'text-yellow' : 'text-text-primary';
  return (
    <div className="flex items-center justify-between py-2 border-b border-dashed border-border text-sm last:border-b-0">
      <span className="text-text-mid">{label}</span>
      <span className={`font-mono font-semibold ${valueColor}`}>{value}</span>
    </div>
  );
}

export function SnapshotRowList({ rows }: { rows: SnapshotRowType[] }) {
  return (
    <div>
      {rows.map((row) => {
        const inner = <SnapshotRowInner key={row.label} {...row} />;
        if (row.modeVisibility) {
          return <ModeVisible key={row.label} show={row.modeVisibility}>{inner}</ModeVisible>;
        }
        return inner;
      })}
    </div>
  );
}
