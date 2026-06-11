'use client';

import Link from 'next/link';
import { timelineSections } from '@/data/home';
import { ModeVisible } from '@/components/ui/ModeVisible';

const variantColors = {
  imminent: { dot: 'bg-red', text: 'text-red' },
  upcoming: { dot: 'bg-yellow', text: 'text-yellow' },
  future: { dot: 'bg-text-dim', text: 'text-text-dim' },
} as const;

export function Timeline() {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3.5 bg-gradient-to-b from-[#fafbfc] to-white border-b border-border flex justify-between items-center flex-wrap gap-2">
        <div className="text-sm font-bold text-navy uppercase tracking-[0.8px]">Coming up</div>
        <Link
          href="/calendar"
          className="text-[10px] font-semibold text-text-mid border border-border-mid rounded-[5px] px-[9px] py-[3px] no-underline hover:bg-bg hover:border-accent hover:text-accent"
        >
          View full calendar →
        </Link>
      </div>
      <div>
        {timelineSections.map((section) => {
          const colors = variantColors[section.variant];
          return (
            <div key={section.label} className="px-4 py-3 border-b border-border last:border-b-0">
              <div className={`text-[9px] font-bold uppercase tracking-[1.2px] mb-2 flex items-center gap-1.5 ${colors.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {section.label}
              </div>
              {section.items.map((item) => {
                const content = (
                  <div
                    key={`${item.date.day}-${item.date.month}-${item.title}`}
                    className="flex gap-3 py-2.5 border-b border-dashed border-border last:border-b-0 cursor-pointer hover:bg-[#fafbfc] hover:mx-[-16px] hover:px-4 transition-colors"
                  >
                    <div className="font-mono text-[10px] font-bold text-text-mid w-[54px] shrink-0 text-center pt-0.5">
                      <span className="text-[18px] text-navy leading-none block">{item.date.day}</span>
                      <span className="text-[9px] text-text-dim uppercase tracking-[0.8px] mt-0.5 block">{item.date.month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-text-primary leading-tight">
                        {item.title}
                        {item.tag && (
                          <span
                            className="inline-flex text-[9px] font-bold px-1.5 py-0.5 rounded ml-1 uppercase tracking-[0.4px] align-middle"
                            style={{ background: item.tag.bgColor, color: item.tag.color }}
                          >
                            {item.tag.label}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-text-dim mt-0.5 font-mono">{item.subtitle}</div>
                    </div>
                  </div>
                );

                if (item.modeVisibility) {
                  return (
                    <ModeVisible key={`${item.date.day}-${item.date.month}`} show={item.modeVisibility}>
                      {item.href ? <Link href={item.href} className="no-underline block">{content}</Link> : content}
                    </ModeVisible>
                  );
                }
                return item.href ? <Link key={`${item.date.day}-${item.date.month}`} href={item.href} className="no-underline block">{content}</Link> : content;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
