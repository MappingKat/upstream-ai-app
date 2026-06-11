const variants = {
  ok: 'bg-green-bg text-green border-green-border',
  warn: 'bg-yellow-bg text-yellow border-yellow-border',
  alert: 'bg-red-bg text-red border-red-border',
  navy: 'bg-navy/[0.08] text-navy border-navy/[0.16]',
  purple: 'bg-purple-bg text-purple border-purple/[0.22]',
  mid: 'bg-bg text-text-mid border-border-mid',
} as const;

export function Tag({
  children,
  variant = 'mid',
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
}) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-[3px] rounded-[20px] uppercase tracking-[0.4px] border ${variants[variant]}`}>
      {children}
    </span>
  );
}
