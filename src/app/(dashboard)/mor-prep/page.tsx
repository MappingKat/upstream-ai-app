'use client';

import { exportCsv, exportPdfViaPrint, showToast } from '@/lib/export';

const morParams = [
  { name: 'CFE Turbidity — Highest', sub: 'Hach 1720E · ≤ 5 NTU max', limit: '≤ 5 NTU', result: '0.414 NTU', resultColor: 'text-green', samples: '186 / 186', detail: 'Mar 14 · 14:00–18:00 block', status: 'Pass', statusVariant: 'ok' },
  { name: 'CFE Turbidity — 95% TT', sub: 'Treatment Technique · ≥ 95% ≤ 1 NTU', limit: '≥ 95% ≤ 1 NTU', result: '100%', resultColor: 'text-green', samples: '186 / 186', detail: '0 of 186 readings > 1 NTU', status: 'Pass', statusVariant: 'ok' },
  { name: 'Disinfection — Lowest Cl₂', sub: 'DPD field kit · ≥ 0.2 mg/L entering distribution', limit: '≥ 0.2 mg/L', result: '0.82 mg/L', resultColor: 'text-yellow', samples: '184 / 186', detail: 'Mar 26 · 04:00–08:00 block · margin 0.62', status: 'Tight', statusVariant: 'warn', tight: true },
  { name: 'Duration below minimum', sub: 'CDPHE notification triggered if > 4 hr', limit: '< 4 hr', result: '0 hr', resultColor: 'text-green', samples: '—', detail: 'No readings below 0.2 mg/L threshold', status: 'Pass', statusVariant: 'ok' },
  { name: 'Sampling completeness', sub: '4-hour blocks · 31 days · 6 blocks/day', limit: '100% required', result: '98.9%', resultColor: 'text-green', samples: '184 of 186 + 2 NODI', detail: '2 gaps tagged NODI Code E · equipment', status: 'Pass', statusVariant: 'ok' },
  { name: 'Plant-off hours', sub: 'Source/treatment offline reporting', limit: 'Report only', result: '0 hr', resultColor: '', samples: '—', detail: 'Continuous operation entire month', status: 'Reported', statusVariant: 'ok' },
];

const tagStyles = { ok: 'bg-green-bg text-green border-green-border', warn: 'bg-yellow-bg text-yellow border-yellow-border' };

export default function MorPrepPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy tracking-tight">MOR <em className="font-serif italic font-bold">Prep</em></h1>
          <p className="text-sm text-text-dim mt-[3px]">Town of Alma · PWS CO0147001 · Monthly Operating Report · Drinking Water · CDPHE Reg 11</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportPdfViaPrint('March 2026 MOR — Town of Alma')} className="bg-surface border border-border-mid text-text-mid px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer">📄 Export PDF</button>
          <button onClick={() => {
            exportCsv(morParams.map(p => ({ Parameter: p.name, Limit: p.limit, Result: p.result, Samples: p.samples, Detail: p.detail, Status: p.status })), 'upstream_MOR_March-2026.csv');
            showToast('MOR data exported to CSV');
          }} className="bg-surface border border-border-mid text-text-mid px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer">📥 Download CDPHE XLSX</button>
        </div>
      </div>

      {/* Draft banner */}
      <div className="bg-yellow-bg border border-yellow-border rounded-[10px] px-4 py-3.5 mb-3.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center shrink-0 text-yellow text-md font-bold">⚠</div>
        <div className="text-sm text-text-primary leading-relaxed">
          <div className="font-semibold text-yellow">Draft — Operator review required</div>
          <div className="text-text-mid mt-[3px]">Calculated from your March daily log. Upstream is a calculation aid only; submission via wqcdcompliance.com remains the responsible party&apos;s responsibility.</div>
        </div>
      </div>

      {/* Period card */}
      <div className="bg-surface border border-border rounded-xl px-5 py-4 mb-3.5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-[9px] font-bold text-text-dim uppercase tracking-[1px]">Reporting period</div>
          <div className="text-md font-bold text-navy font-mono mt-[3px]">March 2026</div>
          <div className="text-xs text-text-mid mt-0.5">31 days · 186 turbidity readings · 186 disinfection readings</div>
        </div>
        <div>
          <div className="text-[9px] font-bold text-text-dim uppercase tracking-[1px]">Due to CDPHE</div>
          <div className="text-md font-bold text-red font-mono mt-[3px]">Apr 10, 2026</div>
          <div className="text-xs text-text-mid mt-0.5">7 days remaining · submit via wqcdcompliance.com</div>
        </div>
        <div>
          <div className="text-[9px] font-bold text-text-dim uppercase tracking-[1px]">Operator in responsible charge</div>
          <div className="text-md font-bold text-navy mt-[3px]">Gary G.</div>
          <div className="text-xs text-text-mid mt-0.5">Town Administrator · ORC signatory</div>
        </div>
      </div>

      {/* Parameter table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden mb-3.5">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Parameter','Limit','March result','# samples','Detail','Status'].map(h => (
                <th key={h} className="bg-bg px-3.5 py-[11px] text-left text-[10px] font-bold text-text-dim uppercase tracking-[0.8px] border-b border-border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {morParams.map(p => (
              <tr key={p.name} className={p.tight ? 'bg-yellow-bg' : ''}>
                <td className="px-3.5 py-[13px] border-b border-border">
                  <div className="font-bold text-navy text-base">{p.name}</div>
                  <div className="text-[10px] text-text-dim mt-0.5 font-mono">{p.sub}</div>
                </td>
                <td className="px-3.5 py-[13px] border-b border-border font-mono text-xs">{p.limit}</td>
                <td className={`px-3.5 py-[13px] border-b border-border text-right font-mono font-semibold ${p.resultColor}`}>{p.result}</td>
                <td className="px-3.5 py-[13px] border-b border-border text-right font-mono font-semibold">{p.samples}</td>
                <td className="px-3.5 py-[13px] border-b border-border font-mono text-[10px] text-text-mid">{p.detail}</td>
                <td className="px-3.5 py-[13px] border-b border-border">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-[3px] rounded-[20px] uppercase tracking-[0.4px] border ${tagStyles[p.statusVariant as keyof typeof tagStyles]}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cl₂ note */}
      <div className="bg-green-bg/50 border border-green-border rounded-[10px] px-4 py-3.5 mb-3.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-water-dim flex items-center justify-center shrink-0 text-green text-md font-bold">💡</div>
        <div className="text-sm text-text-primary leading-relaxed">
          <div className="font-semibold text-green">Note — Cl₂ residual margin</div>
          <div className="text-text-mid mt-[3px]">March&apos;s lowest Cl₂ residual (0.82 mg/L) passes by a healthy margin, but the trend over the last 6 months shows residual margin tightening. Worth a chlorinator feed-rate inspection before April readings.</div>
        </div>
      </div>

      {/* Operator certification */}
      <div className="bg-surface border border-border rounded-xl p-[18px_22px] mb-3.5">
        <div className="text-sm font-bold text-navy uppercase tracking-[0.8px] mb-2.5">Operator certification — Gary Goettelman</div>
        <div className="text-xs text-text-mid italic leading-relaxed p-3 bg-bg border-l-[3px] border-accent rounded-[5px] mb-3">
          &quot;I certify under penalty of law that this document and all attachments were prepared under my direction or supervision in accordance with a system designed to assure that qualified personnel properly gather and evaluate the information submitted...&quot;
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={() => showToast('Draft saved to local storage')} className="bg-surface border border-border-mid text-text-mid px-3.5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer">💾 Save draft</button>
          <button onClick={() => showToast('MOR approved — ready for submission via wqcdcompliance.com')} className="bg-navy text-white px-3.5 py-[9px] rounded-lg text-sm font-bold flex-1 min-w-[200px] cursor-pointer border-none">✓ Approve &amp; ready for submission →</button>
        </div>
        <div className="text-[10px] text-text-dim mt-2.5 font-mono">After approval, download the populated CDPHE XLSX and submit via wqcdcompliance.com/login</div>
      </div>
    </div>
  );
}
