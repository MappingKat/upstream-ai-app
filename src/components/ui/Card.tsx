import type { ReactNode } from 'react';

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-surface border border-border rounded-xl p-4 mb-3.5 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
      <div className="text-sm font-bold text-navy uppercase tracking-[0.8px]">{title}</div>
      {action}
    </div>
  );
}
