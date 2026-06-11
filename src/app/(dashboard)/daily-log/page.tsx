'use client';

import { ModeVisible } from '@/components/ui/ModeVisible';
import { showToast } from '@/lib/export';
import { enqueue } from '@/lib/offline';
import { isOnline } from '@/lib/offline';

const dwBlocks = ['00:00–04:00', '04:00–08:00', '08:00–12:00', '12:00–16:00', '16:00–20:00', '20:00–24:00'];
const turbValues = ['0.32', '0.28', '0.31', '0.41', '0.38', null];
const cl2Values = ['0.84', null, '0.86', '0.91', '0.88', null];
const initials = ['BJ', 'BJ*', 'BJ', 'BJ', 'BJ', null];

export default function DailyLogPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy tracking-tight">Daily <em className="font-serif italic font-bold">Log</em></h1>
          <p className="text-sm text-text-dim mt-[3px]">Field readings · 4-hour blocks · feeds the MOR + DMR automatically · Mar 14, 2026 · Operator: Bobby</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => showToast('Date picker coming soon')} className="bg-surface border border-border-mid text-text-mid px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer">📅 Pick date</button>
          <button onClick={() => {
            // Collect all input values from the form
            const inputs = document.querySelectorAll<HTMLInputElement>('.dl-section-body input, .dl-section-body textarea');
            const readings: { key: string; value: string }[] = [];
            inputs.forEach(input => {
              if (input.value) readings.push({ key: input.placeholder || 'reading', value: input.value });
            });
            const notes = document.querySelector<HTMLTextAreaElement>('textarea')?.value || '';

            if (isOnline()) {
              // TODO: call saveLogEntry server action when Supabase is seeded
              showToast(`Day saved — ${readings.length} readings captured`);
            } else {
              enqueue('save_log', { date: '2026-03-14', notes, readings });
              showToast(`Saved offline — ${readings.length} readings queued for sync`);
            }
          }} className="bg-navy text-white px-3.5 py-[9px] rounded-lg text-sm font-semibold cursor-pointer border-none">💾 Save day</button>
        </div>
      </div>

      {/* Date toolbar */}
      <div className="bg-surface border border-border rounded-xl px-4 py-3 mb-3.5 flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-base font-bold text-navy">Saturday, March <em className="font-serif italic text-accent">14</em>, 2026</div>
          <div className="text-[10px] text-text-dim font-mono mt-[3px]">Started 06:00 · Last save 11:42 AM · Auto-save on</div>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => showToast('Previous day: Mar 13')} className="text-[10px] font-semibold px-[9px] py-[3px] rounded-[5px] border border-border-mid text-text-mid bg-surface cursor-pointer">← Mar 13</button>
          <button onClick={() => showToast('Next day: Mar 15')} className="text-[10px] font-semibold px-[9px] py-[3px] rounded-[5px] border border-border-mid text-text-mid bg-surface cursor-pointer">Mar 15 →</button>
        </div>
      </div>

      {/* SCADA savings banner */}
      <div className="bg-water-dim border border-green-border rounded-[10px] px-3.5 py-[11px] mb-3 flex items-center gap-2.5 text-xs text-text-primary">
        <span className="text-[18px]">⚡</span>
        <div className="flex-1"><strong className="text-green">SCADA auto-fill saved Bobby ~38 min today.</strong> 14 of 18 readings pulled automatically · 4 manual entries needed · 1 out-of-range flag for review.</div>
      </div>

      {/* DW Section */}
      <ModeVisible show="dw">
        <div className="bg-surface border border-border rounded-xl overflow-hidden mb-3.5">
          <div className="px-4 py-3 bg-gradient-to-b from-[#fafbfc] to-white border-b border-border flex items-center gap-3 flex-wrap">
            <div className="w-7 h-7 rounded-[7px] bg-bg flex items-center justify-center text-sm">💧</div>
            <div>
              <div className="text-sm font-bold text-navy uppercase tracking-[0.8px]">Drinking water — 4-hour blocks</div>
              <div className="text-[10px] text-text-mid font-mono mt-px">CFE turbidity + Cl₂ residual entering distribution · SCADA-tagged where available</div>
            </div>
            <div className="ml-auto"><span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-[3px] rounded-[20px] uppercase border bg-green-bg text-green border-green-border">5 / 6 complete · 4 from SCADA</span></div>
          </div>
          <div className="flex gap-3.5 text-[10px] text-text-mid px-3.5 py-2 bg-bg border-b border-border items-center flex-wrap">
            <span className="inline-flex items-center gap-[5px]"><span className="w-[11px] h-[11px] rounded-[3px] bg-green-bg border-[1.5px] border-green-border" />Live SCADA</span>
            <span className="inline-flex items-center gap-[5px]"><span className="w-[11px] h-[11px] rounded-[3px] bg-surface border-[1.5px] border-border-mid" />Manual entry</span>
            <span className="inline-flex items-center gap-[5px]"><span className="w-[11px] h-[11px] rounded-[3px] bg-red-bg border-[1.5px] border-red-border" />Out-of-range</span>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="bg-bg px-2.5 py-2 text-[9px] font-bold text-text-dim uppercase tracking-[0.8px] border-b border-border text-left">Block</th>
                  {dwBlocks.map(b => <th key={b} className="bg-bg px-2.5 py-2 text-[9px] font-bold text-text-dim uppercase tracking-[0.8px] border-b border-border text-center">{b}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2.5 py-[9px] border-b border-border font-semibold text-navy text-sm">CFE Turbidity <span className="font-mono text-[9px] text-text-dim font-normal block">NTU · ≤ 1 · 📡 SCADA</span></td>
                  {turbValues.map((v, i) => (
                    <td key={i} className="px-2.5 py-[9px] border-b border-border text-center">
                      {v ? (
                        <div className="bg-green-bg text-green font-bold px-[7px] py-[5px] font-mono text-[11px] border-[1.5px] border-green-border rounded-[5px] inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green" style={{ animation: 'pulse-dot 2s infinite' }} />{v}
                        </div>
                      ) : (
                        <input className="w-[60px] px-1.5 py-[5px] border border-border rounded-[5px] font-mono text-[11px] text-center text-text-primary bg-surface" placeholder="awaiting" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-2.5 py-[9px] border-b border-border font-semibold text-navy text-sm">Cl₂ residual <span className="font-mono text-[9px] text-text-dim font-normal block">mg/L · ≥ 0.2 · ✋ Manual</span></td>
                  {cl2Values.map((v, i) => (
                    <td key={i} className="px-2.5 py-[9px] border-b border-border text-center">
                      {i === 1 ? (
                        <div className="bg-red-bg text-red font-bold px-[5px] py-[5px] font-mono text-[11px] border-[1.5px] border-red-border rounded-[5px] text-center">
                          0.04 → mnl<span className="block text-[8px] font-bold uppercase tracking-[0.6px] mt-0.5">probe fouled</span>
                        </div>
                      ) : v ? (
                        <input className="w-[60px] px-1.5 py-[5px] border border-border-mid rounded-[5px] font-mono text-[11px] text-center text-text-primary bg-[#f9fbfd] font-semibold" defaultValue={v} />
                      ) : (
                        <input className="w-[60px] px-1.5 py-[5px] border border-border rounded-[5px] font-mono text-[11px] text-center text-text-primary bg-surface" placeholder="—" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-2.5 py-[9px] font-semibold text-navy text-sm">Initials <span className="font-mono text-[9px] text-text-dim font-normal block">audit trail</span></td>
                  {initials.map((v, i) => (
                    <td key={i} className="px-2.5 py-[9px] text-center">
                      <input className={`w-[30px] px-1 py-[5px] border border-border-mid rounded-[5px] font-mono text-[11px] text-center ${v ? 'text-green font-bold bg-[#f9fbfd]' : 'bg-surface text-text-primary'}`} defaultValue={v ?? ''} placeholder="—" />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-4 gap-2.5 px-4 py-3.5 border-t border-border max-[700px]:grid-cols-2">
            {[
              { label: 'Day high turbidity', value: '0.41' },
              { label: 'Day low Cl₂', value: '0.82', warn: true },
              { label: '% < 1 NTU', value: '100%', ok: true },
              { label: 'Blocks complete', value: '5 / 6' },
            ].map(s => (
              <div key={s.label} className="bg-bg rounded-lg px-3 py-2.5">
                <div className="text-[9px] font-bold text-text-dim uppercase tracking-[1px] mb-[3px]">{s.label}</div>
                <div className={`font-mono text-base font-bold ${s.warn ? 'text-yellow' : s.ok ? 'text-green' : 'text-navy'}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </ModeVisible>

      {/* WW Section */}
      <ModeVisible show="ww">
        <div className="bg-surface border border-border rounded-xl overflow-hidden mb-3.5">
          <div className="px-4 py-3 bg-gradient-to-b from-[#fafbfc] to-white border-b border-border flex items-center gap-3 flex-wrap">
            <div className="w-7 h-7 rounded-[7px] bg-bg flex items-center justify-center text-sm">🌊</div>
            <div>
              <div className="text-sm font-bold text-navy uppercase tracking-[0.8px]">Wastewater — lagoon &amp; effluent</div>
              <div className="text-[10px] text-text-mid font-mono mt-px">Bench readings (manual) · SCADA pulls flow + DO automatically</div>
            </div>
            <div className="ml-auto"><span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-[3px] rounded-[20px] uppercase border bg-green-bg text-green border-green-border">Complete · 2 from SCADA</span></div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-4 gap-3.5 max-[700px]:grid-cols-2">
              {[
                { label: 'DO (effluent)', tag: '📡 SCADA', value: '6.8', unit: 'mg/L · ≥ 6.0 · live 11:42', live: true },
                { label: 'pH (effluent)', tag: '✋ manual', value: '7.6', unit: 'SU · 6.5 – 9.0 · no tag', live: false },
                { label: 'Temperature', tag: '✋ manual', value: '11.2', unit: '°C · report only', live: false },
                { label: 'Flow (effluent)', tag: '📡 SCADA', value: '0.087', unit: 'MGD · live 11:42 · tag FE-01', live: true },
              ].map(f => (
                <div key={f.label}>
                  <div className="text-[9px] font-bold text-text-dim uppercase tracking-[1px] mb-1">{f.label} <span className="font-normal text-text-dim">{f.tag}</span></div>
                  {f.live ? (
                    <div className="bg-green-bg text-green font-bold px-[7px] py-[7px] font-mono text-[11px] border-[1.5px] border-green-border rounded-[5px] flex items-center justify-center gap-1 w-full mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green" style={{ animation: 'pulse-dot 2s infinite' }} />{f.value}
                    </div>
                  ) : (
                    <input className="w-full px-2 py-[7px] border border-border-mid rounded-[5px] font-mono text-[11px] text-text-primary bg-[#f9fbfd] font-semibold mt-1" defaultValue={f.value} />
                  )}
                  <div className="text-[10px] text-text-dim mt-[3px] font-mono">{f.unit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModeVisible>

      {/* Field observations */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden mb-3.5">
        <div className="px-4 py-3 bg-gradient-to-b from-[#fafbfc] to-white border-b border-border flex items-center gap-3">
          <div className="w-7 h-7 rounded-[7px] bg-bg flex items-center justify-center text-sm">📝</div>
          <div>
            <div className="text-sm font-bold text-navy uppercase tracking-[0.8px]">Field observations</div>
            <div className="text-[10px] text-text-mid font-mono mt-px">Plant status · weather · maintenance · unusual conditions</div>
          </div>
        </div>
        <div className="p-4">
          <textarea className="w-full min-h-[80px] px-3 py-2.5 border border-border rounded-lg text-xs text-text-primary bg-surface resize-y leading-relaxed focus:outline-none focus:border-accent" defaultValue="Light snow morning, 4&quot; overnight. Lagoon ice receding on Cell 1 west side. Chlorinator running steady — feed pump replaced last week, performing well. DPD kit reagent good through April 22. No plant-offs." />
          <div className="flex gap-2 mt-2.5 flex-wrap">
            <button onClick={() => showToast('Photo upload coming soon')} className="text-[10px] font-semibold px-[9px] py-[3px] rounded-[5px] border border-border-mid text-text-mid cursor-pointer">+ Add photo</button>
            <button onClick={() => showToast('Equipment issue form coming soon')} className="text-[10px] font-semibold px-[9px] py-[3px] rounded-[5px] border border-border-mid text-text-mid cursor-pointer">+ Equipment issue</button>
            <button onClick={() => showToast('Plant-off event form coming soon')} className="text-[10px] font-semibold px-[9px] py-[3px] rounded-[5px] border border-border-mid text-text-mid cursor-pointer">+ Plant-off event</button>
          </div>
        </div>
      </div>
    </div>
  );
}
