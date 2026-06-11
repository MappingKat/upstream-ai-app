'use client';

import { useState } from 'react';
import Link from 'next/link';
import { exportPdfViaPrint, exportCsv, showToast } from '@/lib/export';
import { enqueue, isOnline } from '@/lib/offline';

const gapRows = [
  { date: 'Tuesday, March 11 · 8a – 12p', detail: 'Cl₂ residual reading missing · Bobby off-site for system inspection at Park County', resolved: false, code: null },
  { date: 'Thursday, March 19 · 12p – 4p', detail: 'Cl₂ residual reading missing · DPD test kit reagent expired · Replacement arrived Mar 20', resolved: false, code: 'E — Equipment failure (DPD kit)' },
  { date: 'Sunday, March 23 · 12a – 4a', detail: 'Cl₂ residual gap · Resolved Apr 2 by Bobby', resolved: true, code: 'E' },
];

const bod5Rows = [
  { ref: 'B4', date: 'Apr 7', labId: '26-04-0142', source: 'Colorado Analytical', value: '16', status: 'incl' },
  { ref: 'B5', date: 'Apr 10', labId: '26-04-0198', source: 'Colorado Analytical', value: '47', status: 'excl', excluded: true },
  { ref: 'B6', date: 'Apr 14', labId: '26-04-0287', source: 'Colorado Analytical', value: '19', status: 'incl' },
  { ref: 'B7', date: 'Apr 21', labId: '26-04-0431', source: 'Colorado Analytical', value: '20', status: 'incl' },
  { ref: 'B8', date: 'Apr 28', labId: '26-04-0566', source: 'Colorado Analytical', value: '17', status: 'incl' },
];

export default function DmrPrepPage() {
  const [gaps, setGaps] = useState(gapRows);

  function handleResolve(index: number, nodiCode: string) {
    if (!nodiCode) return;
    const updated = [...gaps];
    updated[index] = { ...updated[index], resolved: true, code: nodiCode };
    setGaps(updated);

    if (isOnline()) {
      // TODO: call resolveDataGap server action when Supabase is seeded
      showToast(`Gap resolved with NODI code ${nodiCode}`);
    } else {
      enqueue('resolve_gap', { date: updated[index].date, nodiCode });
      showToast(`Gap resolved offline — will sync when connected`);
    }
  }

  const unresolvedCount = gaps.filter(g => !g.resolved).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy tracking-tight">March DMR <em className="font-serif italic font-bold">Prep</em></h1>
          <p className="text-sm text-text-dim mt-[3px]">Town of Alma · CDPS COG591177 · 3-cell lagoon · Outfall 001A · Due Apr 28 · NetDMR submission</p>
        </div>
        <div className="flex gap-2">
          <Link href="/lab-samples" className="bg-surface border border-border-mid text-text-mid px-3.5 py-2 rounded-lg text-sm font-semibold no-underline">🧪 Lab Samples</Link>
          <button onClick={() => exportPdfViaPrint('March 2026 DMR — Town of Alma')} className="bg-surface border border-border-mid text-text-mid px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer">📄 Preview PDF</button>
        </div>
      </div>

      {/* Step 1: Resolve Data Gaps */}
      <div className="bg-surface border border-yellow-border rounded-xl mb-3.5 overflow-hidden">
        <div className="px-4 py-3.5 bg-gradient-to-b from-yellow-bg to-white border-b border-yellow-border flex items-center gap-3 flex-wrap">
          <div className="w-7 h-7 rounded-full bg-yellow text-white text-sm font-bold flex items-center justify-center">1</div>
          <div>
            <div className="text-base font-bold text-navy">Resolve data gaps <span className="font-normal text-text-mid text-xs">— 2 days need attention</span></div>
            <div className="text-xs text-text-mid mt-0.5">Tag each missing reading with the appropriate code. Blank cells in NetDMR become failure-to-report violations.</div>
          </div>
          <div className="ml-auto"><span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-[3px] rounded-[20px] uppercase tracking-[0.4px] border ${unresolvedCount > 0 ? 'bg-yellow-bg text-yellow border-yellow-border' : 'bg-green-bg text-green border-green-border'}`}>{unresolvedCount > 0 ? `${unresolvedCount} unresolved` : 'All resolved ✓'}</span></div>
        </div>
        <div className="p-4">
          {gaps.map((gap, i) => (
            <div key={i} className={`flex items-center gap-3 px-3.5 py-3 rounded-[9px] mb-2 last:mb-0 flex-wrap ${gap.resolved ? 'bg-green-bg border border-green-border' : 'bg-yellow-bg border border-yellow-border'}`}>
              <div className={`w-[30px] h-[30px] rounded-[7px] bg-surface border flex items-center justify-center shrink-0 text-sm font-bold ${gap.resolved ? 'border-green-border text-green' : 'border-yellow-border text-yellow'}`}>
                {gap.resolved ? '✓' : '⚠'}
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="font-mono text-xs text-text-primary font-semibold">{gap.date}</div>
                <div className="text-[10px] text-text-mid mt-0.5 leading-relaxed">{gap.detail}</div>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                {gap.resolved ? (
                  <span className="font-mono text-[10px] text-green font-bold bg-surface border border-green-border px-2.5 py-[5px] rounded-[6px]">E Equipment</span>
                ) : gap.code ? (
                  <>
                    <select className="px-[11px] py-[7px] border-[1.5px] border-accent bg-accent/[0.04] rounded-[7px] text-xs text-text-primary min-w-[200px]" defaultValue="E">
                      <optgroup label="── Routine / expected ──">
                        <option value="C">C — No discharge (plant offline / no flow)</option>
                        <option value="H">H — Holiday / weekend (no sample required)</option>
                        <option value="N">N — Not required this monitoring period</option>
                        <option value="B">B — Below detection limit</option>
                      </optgroup>
                      <optgroup label="── Operational issue ──">
                        <option value="E">E — Equipment failure (analyzer / kit / probe)</option>
                        <option value="F">F — Insufficient flow to sample</option>
                        <option value="T">T — Operator not on site (sick / leave)</option>
                        <option value="Q">Q — Result not quantifiable</option>
                        <option value="W">W — Reading recovered from logbook</option>
                      </optgroup>
                      <optgroup label="── Needs attention ──">
                        <option value="A">A — General · no specific reason (explain)</option>
                        <option value="9">9 — Conditional (free-form explanation required)</option>
                      </optgroup>
                    </select>
                    <button onClick={() => handleResolve(i, 'E')} className="px-[13px] py-[7px] bg-navy text-white border-none rounded-[7px] text-[10px] font-bold uppercase tracking-[0.5px] cursor-pointer">Resolve →</button>
                  </>
                ) : (
                  <>
                    <select data-gap-index={i} className="px-[11px] py-[7px] border-[1.5px] border-border-mid rounded-[7px] text-xs text-text-primary min-w-[200px]">
                      <option value="">What happened on this day? ▾</option>
                      <optgroup label="── Routine / expected (no plant issue) ──">
                        <option value="C">C — No discharge (plant offline / no flow)</option>
                        <option value="H">H — Holiday / weekend (no sample required)</option>
                        <option value="N">N — Not required this monitoring period</option>
                        <option value="B">B — Below detection limit</option>
                      </optgroup>
                      <optgroup label="── Operational issue (watch &amp; document) ──">
                        <option value="E">E — Equipment failure (analyzer / kit / probe)</option>
                        <option value="F">F — Insufficient flow to sample</option>
                        <option value="T">T — Operator not on site (sick / leave)</option>
                        <option value="Q">Q — Result not quantifiable</option>
                        <option value="W">W — Reading recovered from logbook</option>
                      </optgroup>
                      <optgroup label="── Needs attention / explanation ──">
                        <option value="A">A — General · no specific reason (explain)</option>
                        <option value="9">9 — Conditional (free-form explanation required)</option>
                      </optgroup>
                    </select>
                    <button onClick={() => {
                      const select = document.querySelector<HTMLSelectElement>(`[data-gap-index="${i}"]`);
                      if (select?.value) handleResolve(i, select.value);
                    }} className="px-[13px] py-[7px] bg-navy text-white border-none rounded-[7px] text-[10px] font-bold uppercase tracking-[0.5px] cursor-pointer hover:bg-accent">Resolve →</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Review Calculations — BOD₅ */}
      <div className="bg-surface border border-border rounded-xl mb-3.5 overflow-hidden">
        <div className="px-4 py-3.5 bg-gradient-to-b from-[#fafbfc] to-white border-b border-border flex items-center gap-3 flex-wrap">
          <div className="w-7 h-7 rounded-full bg-navy text-white text-sm font-bold flex items-center justify-center">2</div>
          <div>
            <div className="text-base font-bold text-navy">Review calculations <span className="font-normal text-text-mid text-xs">— 8 reported values from 14 logged samples</span></div>
            <div className="text-xs text-text-mid mt-0.5">Each calculated parameter shows the source data, the formula, and the reported value.</div>
          </div>
          <div className="ml-auto"><span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-[3px] rounded-[20px] uppercase tracking-[0.4px] border bg-green-bg text-green border-green-border">Ready for review</span></div>
        </div>

        {/* BOD₅ block */}
        <div className="border-b border-border">
          <div className="flex items-center justify-between px-[18px] py-2.5 bg-bg border-b border-border flex-wrap gap-2">
            <div>
              <div className="text-sm font-bold text-navy">BOD₅ — <em className="font-serif italic font-bold text-accent">Monthly</em> average</div>
              <div className="font-mono text-[10px] text-text-dim">SM 5210-B · ≤ 30 mg/L · 4 incl + 1 excl</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-[9px] bg-[#fafbfc] border-b border-border flex-wrap">
            <span className="font-mono bg-surface border border-border px-2.5 py-1 rounded-[5px] text-navy font-bold text-xs">B9</span>
            <span className="font-serif italic font-bold text-accent text-base">fx</span>
            <span className="font-mono text-xs text-text-primary bg-yellow-bg border border-yellow-border px-2.5 py-[5px] rounded-[5px] flex-1">
              <span className="text-accent font-bold">=AVG(</span>B4, B6, B7, B8<span className="text-accent font-bold">)</span> = <span className="text-green font-bold">18 mg/L</span> <span className="text-text-dim">// excludes B5 (hold-time violation)</span>
            </span>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Ref','Date','Lab ID','Source','Value','Status'].map(h => (
                  <th key={h} className="bg-[#fafbfc] px-3 py-[7px] text-left text-[9px] font-bold text-text-dim uppercase tracking-[0.8px] border-b-[1.5px] border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bod5Rows.map(r => (
                <tr key={r.ref} className={r.excluded ? 'text-text-dim' : ''}>
                  <td className="px-3 py-2 border-b border-border font-mono text-[10px] font-semibold text-text-dim">{r.ref}</td>
                  <td className={`px-3 py-2 border-b border-border font-mono text-xs ${r.excluded ? 'line-through' : ''}`}>{r.date}</td>
                  <td className={`px-3 py-2 border-b border-border font-mono text-xs ${r.excluded ? 'line-through' : ''}`}>{r.labId}</td>
                  <td className="px-3 py-2 border-b border-border text-xs">{r.source}</td>
                  <td className={`px-3 py-2 border-b border-border font-mono text-right ${r.excluded ? 'line-through' : ''}`}>{r.value}</td>
                  <td className="px-3 py-2 border-b border-border text-right">
                    <span className={`inline-flex text-[9px] font-bold px-[7px] py-[2px] rounded uppercase tracking-[0.4px] ${r.status === 'incl' ? 'bg-green-bg text-green' : 'bg-bg text-text-dim'}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
              <tr className="font-bold text-navy border-t-2 border-accent border-b-2">
                <td className="px-3 py-[11px] text-accent font-mono font-bold">B9</td>
                <td className="px-3 py-[11px] text-[10px] text-accent uppercase tracking-[0.6px]">Reported</td>
                <td colSpan={2} className="px-3 py-[11px] font-mono text-text-mid text-[10px] font-normal">Monthly average · 4 of 5 samples included</td>
                <td className="px-3 py-[11px] text-right font-mono text-md">18</td>
                <td className="px-3 py-[11px] text-right"><span className="inline-flex text-[9px] font-bold px-[7px] py-[2px] rounded uppercase bg-green-bg text-green border border-green-border">PASS</span></td>
              </tr>
            </tbody>
          </table>
          <div className="px-3.5 py-2 bg-[#fafbfc] text-[10px] text-text-dim font-mono border-t border-border">
            Permit limit: <strong className="text-text-primary">≤ 30 mg/L monthly average</strong> · Margin to limit: 12 mg/L (60% headroom)
          </div>
        </div>
      </div>

      {/* Step 3: Certify Bar */}
      <div className={`sticky bottom-0 bg-surface border-t-2 shadow-[0_-4px_16px_rgba(26,58,92,0.08)] px-4 py-3 flex items-center justify-between flex-wrap gap-3 ${unresolvedCount > 0 ? 'border-yellow bg-gradient-to-b from-yellow-bg to-white' : 'border-navy'}`}>
        <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-md font-bold ${unresolvedCount > 0 ? 'bg-yellow-bg text-yellow' : 'bg-green-bg text-green'}`}>3</div>
          <div>
            <div className="text-sm font-bold text-navy">{unresolvedCount > 0 ? 'Certify & export — blocked' : 'Certify & export — ready'}</div>
            <div className="text-[10px] text-text-mid mt-px">
              {unresolvedCount > 0 ? `${unresolvedCount} unresolved gap${unresolvedCount > 1 ? 's' : ''}. Resolve to enable.` : 'All gaps resolved.'}{' '}
              <strong className="text-navy">25 days</strong> until NetDMR due (Apr 28).
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportPdfViaPrint('March 2026 DMR — Town of Alma')} className="bg-surface border border-border-mid text-text-mid px-3.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer">📄 Preview PDF</button>
          <button
            disabled={unresolvedCount > 0}
            onClick={() => {
              exportCsv(bod5Rows.filter(r => !r.excluded).map(r => ({ Ref: r.ref, Date: r.date, LabID: r.labId, Value: r.value })), 'upstream_DMR_NetDMR.csv');
              showToast('NetDMR XML generated — ready for submission');
            }}
            className={`px-[18px] py-2.5 rounded-lg text-sm font-bold border-none ${unresolvedCount > 0 ? 'bg-text-dim text-white opacity-50 cursor-not-allowed' : 'bg-navy text-white cursor-pointer hover:bg-accent'}`}
          >
            Certify &amp; generate NetDMR XML →
          </button>
        </div>
      </div>
    </div>
  );
}
