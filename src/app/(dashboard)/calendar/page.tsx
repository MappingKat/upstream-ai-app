'use client';

import { ModeVisible } from '@/components/ui/ModeVisible';
import { exportICal, showToast } from '@/lib/export';

const calendarDays = [
  { day: 29, outside: true }, { day: 30, outside: true }, { day: 31, outside: true },
  { day: 1 }, { day: 2 },
  { day: 3, today: true, events: [{ label: '⊙ DPD field reading', type: 'sample' as const, mode: 'dw' as const }] },
  { day: 4 },
  { day: 5 }, { day: 6 },
  { day: 7, events: [
    { label: '⚪ BOD₅ pickup', type: 'sample' as const, mode: 'ww' as const },
    { label: '⚪ TSS pickup', type: 'sample' as const, mode: 'ww' as const },
  ]},
  { day: 8, events: [{ label: '⊙ DPD field reading', type: 'sample' as const, mode: 'dw' as const }] },
  { day: 9, events: [{ label: '⚪ NH₃-N pickup', type: 'sample' as const, mode: 'ww' as const }] },
  { day: 10, events: [{ label: '⚑ March MOR due', type: 'deadline' as const, mode: 'dw' as const }] },
  { day: 11 },
  { day: 12 }, { day: 13 },
  { day: 14, events: [{ label: '⚪ BOD₅ pickup', type: 'sample' as const, mode: 'ww' as const }] },
  { day: 15 }, { day: 16 },
  { day: 17, events: [{ label: '⚪ TSS pickup', type: 'sample' as const, mode: 'ww' as const }] },
  { day: 18 },
  { day: 19 }, { day: 20 },
  { day: 21, events: [
    { label: '⚪ BOD₅ pickup', type: 'sample' as const, mode: 'ww' as const },
    { label: '⚪ TSS pickup', type: 'sample' as const, mode: 'ww' as const },
  ]},
  { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 },
  { day: 26 },
  { day: 27, events: [{ label: '⚪ TSS pickup', type: 'sample' as const, mode: 'ww' as const }] },
  { day: 28, events: [
    { label: '⚑ March DMR', type: 'deadline' as const, mode: 'ww' as const },
    { label: '⚪ BOD₅ pickup', type: 'sample' as const, mode: 'ww' as const },
  ]},
  { day: 29 },
  { day: 30, events: [{ label: '⚑ Q1 DBP report', type: 'deadline' as const, mode: 'dw' as const }] },
  { day: 1, outside: true }, { day: 2, outside: true },
];

const chipStyles = {
  deadline: 'bg-red/10 text-red border-l-2 border-red',
  sample: 'bg-bg text-text-mid border-l-2 border-text-dim',
  renewal: 'bg-purple-bg text-purple border-l-2 border-purple',
};

export default function CalendarPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy tracking-tight">Compliance <em className="font-serif italic font-bold">Calendar</em></h1>
          <p className="text-sm text-text-dim mt-[3px]">All deadlines, lab samples, certifications, and renewals · Town of Alma · CO0147001 + COG591177</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => {
            exportICal([
              { title: 'March MOR Due — Drinking Water', date: '2026-04-10', description: 'CDPHE · wqcdcompliance.com' },
              { title: 'March DMR Due — Wastewater', date: '2026-04-28', description: 'NetDMR · COG591177' },
              { title: 'Q1 DBP Report Due', date: '2026-04-30', description: 'TTHM + HAA5 quarterly' },
            ], 'upstream_compliance-calendar.ics');
            showToast('Calendar exported as .ics');
          }} className="bg-surface border border-border-mid text-text-mid px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer">↓ Export iCal</button>
          <button onClick={() => showToast('Custom deadline form coming soon')} className="bg-navy text-white px-3.5 py-[9px] rounded-lg text-sm font-semibold cursor-pointer border-none">＋ Add custom deadline</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface border border-border rounded-xl px-4 py-3 mb-3.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button className="w-[30px] h-[30px] rounded-[6px] border border-border-mid bg-surface text-navy text-sm flex items-center justify-center">‹</button>
          <span className="text-base font-bold text-navy min-w-[120px] text-center">April <em className="font-serif italic text-accent">2026</em></span>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-border-mid bg-surface text-navy text-sm flex items-center justify-center">›</button>
        </div>
        <div className="flex bg-bg border border-border rounded-[7px] p-[2px] gap-px">
          <button className="px-3 py-[5px] bg-surface text-navy text-[10px] font-semibold rounded-[5px] uppercase tracking-[0.5px] shadow-sm">Month</button>
          <button className="px-3 py-[5px] text-text-mid text-[10px] font-semibold rounded-[5px] uppercase tracking-[0.5px]">Year</button>
        </div>
      </div>

      {/* Month Grid */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden mb-3.5">
        <div className="grid grid-cols-7 bg-bg border-b border-border">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="px-2.5 py-[9px] text-[9px] font-bold text-text-dim uppercase tracking-[1px] text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((d, i) => (
            <div key={i} className={`min-h-[96px] p-[7px_8px] border-r border-b border-border relative ${d.outside ? 'bg-[#fafbfc]' : 'bg-surface'} ${d.today ? 'bg-accent/5' : ''} [&:nth-child(7n)]:border-r-0`}>
              <div className={`font-mono text-[11px] font-semibold mb-1 ${d.outside ? 'text-text-dim' : d.today ? 'text-accent font-extrabold' : 'text-text-primary'}`}>{d.day}</div>
              <div className="flex flex-col gap-[3px]">
                {d.events?.map((ev, j) => (
                  <ModeVisible key={j} show={ev.mode}>
                    <div className={`text-[9px] font-semibold px-1.5 py-[3px] rounded leading-tight ${chipStyles[ev.type]}`}>{ev.label}</div>
                  </ModeVisible>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-surface border border-border rounded-xl p-4 px-5 mb-3.5">
        <div className="text-[9px] font-bold text-text-dim uppercase tracking-[1.2px] mb-2">Event Types</div>
        <div className="flex gap-3.5 flex-wrap text-[10px] text-text-mid">
          <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-[3px] bg-red/15 border-l-[3px] border-red" />Deadline</span>
          <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-[3px] bg-purple-bg border-l-[3px] border-purple" />Renewal</span>
          <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-[3px] bg-bg border-l-[3px] border-text-dim" />Lab Sample</span>
        </div>
      </div>
    </div>
  );
}
