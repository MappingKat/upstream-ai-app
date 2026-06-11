'use client';

import { snapshotRows } from '@/data/home';
import { CardHeader } from '@/components/ui/Card';
import { SnapshotRowList } from '@/components/ui/SnapshotRow';

export function AtAGlance() {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 mb-3.5">
      <CardHeader title="At a glance" />
      <SnapshotRowList rows={snapshotRows} />
    </div>
  );
}
