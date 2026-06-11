'use client';

import Link from 'next/link';
import { ModeVisible } from '@/components/ui/ModeVisible';
import { CardHeader } from '@/components/ui/Card';

const actions = [
  { icon: '✏️', label: 'Log readings', href: '/daily-log' },
  { icon: '🧪', label: 'Log sample', href: '/lab-samples' },
  { icon: '📝', label: 'Open MOR', href: '/mor-prep', modeVisibility: 'dw' as const },
  { icon: '📋', label: 'Open DMR', href: '/dmr-prep', modeVisibility: 'ww' as const },
  { icon: '💬', label: 'Ask Upstream', href: '/ask' },
];

export function QuickActions() {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 bg-gradient-to-br from-white to-[#f9fbfd]">
      <CardHeader title="Quick actions" />
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const button = (
            <Link
              key={action.href}
              href={action.href}
              className="bg-surface border border-border-mid text-text-mid px-[9px] py-[9px] rounded-lg text-[10px] font-semibold cursor-pointer hover:bg-bg hover:border-text-dim no-underline flex items-center justify-start gap-1.5 min-h-[38px]"
            >
              {action.icon} {action.label}
            </Link>
          );
          if (action.modeVisibility) {
            return <ModeVisible key={action.href} show={action.modeVisibility}>{button}</ModeVisible>;
          }
          return button;
        })}
      </div>
    </div>
  );
}
