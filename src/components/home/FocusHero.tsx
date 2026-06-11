'use client';

import Link from 'next/link';
import { focusItem } from '@/data/home';

export function FocusHero() {
  const item = focusItem;
  const isOk = item.variant === 'ok';

  return (
    <div
      className={`relative rounded-[14px] px-[22px] py-[18px] mb-3.5 flex items-center gap-4 flex-wrap overflow-hidden ${
        isOk
          ? 'bg-gradient-to-r from-green-bg to-white border-[1.5px] border-green-border'
          : 'bg-gradient-to-r from-yellow-bg to-white border-[1.5px] border-yellow-border'
      }`}
    >
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[5px] ${
          isOk
            ? 'bg-gradient-to-b from-green to-[#22c55e]'
            : 'bg-gradient-to-b from-yellow to-[#f59e0b]'
        }`}
      />

      {/* Icon */}
      <div
        className={`w-[46px] h-[46px] rounded-full flex items-center justify-center text-[22px] shrink-0 text-white ${
          isOk ? 'bg-green' : 'bg-yellow'
        }`}
      >
        ⚡
      </div>

      {/* Text */}
      <div className="flex-1 min-w-[260px]">
        <div className={`text-[9px] font-bold uppercase tracking-[1.5px] ${isOk ? 'text-green' : 'text-yellow'}`}>
          {item.eyebrow}
        </div>
        <div className="text-lg font-bold text-navy mt-[3px] leading-tight">
          {item.title}
        </div>
        <div className="text-xs text-text-mid mt-1 leading-relaxed">
          {item.subtitle}
        </div>
      </div>

      {/* CTA */}
      <Link
        href={item.ctaHref}
        className="px-[18px] py-[11px] bg-navy text-white border-none rounded-[9px] text-sm font-bold cursor-pointer shrink-0 min-h-[42px] hover:bg-accent no-underline inline-flex items-center"
      >
        {item.ctaLabel}
      </Link>
    </div>
  );
}
