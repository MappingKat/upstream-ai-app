'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { exportCsv, showToast } from '@/lib/export';

const dispositions = [
  { label: 'Reported', value: 8, note: 'Goes to DMR · permit-required', color: 'bg-green' },
  { label: 'Held', value: 4, note: 'Process control · not reported', color: 'bg-text-dim' },
  { label: 'Excluded', value: 1, note: 'Analytical anomaly · documented', color: 'bg-red' },
  { label: 'Re-sampled', value: 0, note: 'None this period', color: 'bg-[#d97706]' },
  { label: 'QC', value: 1, note: 'Lab QC · not reportable', color: 'bg-purple' },
];

const samples = [
  // WW samples
  { date: 'Apr 3', param: 'BOD₅', method: 'In-house bench', value: '14', unit: 'mg/L', source: 'In-house', sourceStyle: 'text-[#7e22ce] border-[#7e22ce]/25 bg-[#7e22ce]/[0.04]', disp: 'Held', dispStyle: 'bg-bg text-text-mid border-border-mid', system: 'ww' as const },
  { date: 'Apr 7', param: 'BOD₅', method: 'SM 5210-B (CAL)', value: '16', unit: 'mg/L', source: 'Colorado Analytical', sourceStyle: 'text-accent border-accent/25 bg-accent/[0.04]', disp: 'Reported', dispStyle: 'bg-green-bg text-green border-green-border', system: 'ww' as const },
  { date: 'Apr 7', param: 'TSS', method: 'SM 2540-D (CAL)', value: '10', unit: 'mg/L', source: 'Colorado Analytical', sourceStyle: 'text-accent border-accent/25 bg-accent/[0.04]', disp: 'Reported', dispStyle: 'bg-green-bg text-green border-green-border', system: 'ww' as const },
  { date: 'Apr 9', param: 'NH₃-N', method: 'SM 4500-NH3-G', value: '2.3', unit: 'mg/L', source: 'Colorado Analytical', sourceStyle: 'text-accent border-accent/25 bg-accent/[0.04]', disp: 'Reported', dispStyle: 'bg-green-bg text-green border-green-border', system: 'ww' as const },
  { date: 'Apr 10', param: 'BOD₅', method: 'SM 5210-B (CAL)', value: '47', unit: 'mg/L', source: 'Colorado Analytical', sourceStyle: 'text-accent border-accent/25 bg-accent/[0.04]', disp: 'Excluded', dispStyle: 'bg-red-bg text-red border-red-border', system: 'ww' as const },
  { date: 'Apr 14', param: 'BOD₅', method: 'SM 5210-B (CAL)', value: '19', unit: 'mg/L', source: 'Colorado Analytical', sourceStyle: 'text-accent border-accent/25 bg-accent/[0.04]', disp: 'Reported', dispStyle: 'bg-green-bg text-green border-green-border', system: 'ww' as const },
  { date: 'Apr 14', param: 'BOD₅ (dup)', method: 'SM 5210-B QC', value: '20', unit: 'mg/L', source: 'Colorado Analytical', sourceStyle: 'text-accent border-accent/25 bg-accent/[0.04]', disp: 'QC', dispStyle: 'bg-purple-bg text-purple border-purple/[0.22]', system: 'ww' as const },
  { date: 'Apr 17', param: 'TSS', method: 'SM 2540-D (CAL)', value: '14', unit: 'mg/L', source: 'Colorado Analytical', sourceStyle: 'text-accent border-accent/25 bg-accent/[0.04]', disp: 'Reported', dispStyle: 'bg-green-bg text-green border-green-border', system: 'ww' as const },
  { date: 'Apr 21', param: 'BOD₅', method: 'SM 5210-B (CAL)', value: '20', unit: 'mg/L', source: 'Colorado Analytical', sourceStyle: 'text-accent border-accent/25 bg-accent/[0.04]', disp: 'Reported', dispStyle: 'bg-green-bg text-green border-green-border', system: 'ww' as const },
  { date: 'Apr 21', param: 'TSS', method: 'SM 2540-D (CAL)', value: '11', unit: 'mg/L', source: 'Colorado Analytical', sourceStyle: 'text-accent border-accent/25 bg-accent/[0.04]', disp: 'Reported', dispStyle: 'bg-green-bg text-green border-green-border', system: 'ww' as const },
  { date: 'Apr 27', param: 'TSS', method: 'SM 2540-D (CAL)', value: '13', unit: 'mg/L', source: 'Colorado Analytical', sourceStyle: 'text-accent border-accent/25 bg-accent/[0.04]', disp: 'Reported', dispStyle: 'bg-green-bg text-green border-green-border', system: 'ww' as const },
  // DW samples
  { date: 'Mar 1', param: 'Cl₂ residual', method: 'DPD field kit', value: '0.62', unit: 'mg/L', source: 'In-house', sourceStyle: 'text-[#7e22ce] border-[#7e22ce]/25 bg-[#7e22ce]/[0.04]', disp: 'Reported', dispStyle: 'bg-green-bg text-green border-green-border', system: 'dw' as const },
  { date: 'Mar 14', param: 'CFE Turbidity', method: 'Hach 1720E (SCADA)', value: '0.41', unit: 'NTU', source: 'SCADA', sourceStyle: 'text-green border-green-border bg-green-bg', disp: 'Reported', dispStyle: 'bg-green-bg text-green border-green-border', system: 'dw' as const },
  { date: 'Mar 22', param: 'Cl₂ residual', method: 'DPD field kit', value: '0.31', unit: 'mg/L', source: 'In-house', sourceStyle: 'text-[#7e22ce] border-[#7e22ce]/25 bg-[#7e22ce]/[0.04]', disp: 'Reported', dispStyle: 'bg-green-bg text-green border-green-border', system: 'dw' as const },
  { date: 'Mar 24', param: 'Cl₂ residual', method: 'DPD field kit', value: '0.28', unit: 'mg/L', source: 'In-house', sourceStyle: 'text-[#7e22ce] border-[#7e22ce]/25 bg-[#7e22ce]/[0.04]', disp: 'Reported', dispStyle: 'bg-green-bg text-green border-green-border', system: 'dw' as const },
  { date: 'Mar 31', param: 'Cl₂ residual', method: 'DPD field kit', value: '0.26', unit: 'mg/L', source: 'In-house', sourceStyle: 'text-[#7e22ce] border-[#7e22ce]/25 bg-[#7e22ce]/[0.04]', disp: 'Reported', dispStyle: 'bg-green-bg text-green border-green-border', system: 'dw' as const },
  { date: 'Mar 28', param: 'TTHM + HAA5', method: 'EPA 524.2 · 552.3', value: 'pending', unit: '', source: 'Colorado Analytical', sourceStyle: 'text-accent border-accent/25 bg-accent/[0.04]', disp: 'Held', dispStyle: 'bg-bg text-text-mid border-border-mid', system: 'dw' as const },
];

type FilterKey = 'All' | 'Reported' | 'Held' | 'Excluded' | 'QC';

export default function LabSamplesPage() {
  const { mode } = useApp();
  const [filter, setFilter] = useState<FilterKey>('All');
  const [search, setSearch] = useState('');

  // First filter by system mode
  const modeFiltered = samples.filter(s => {
    if (mode === 'all') return true;
    return s.system === mode;
  });

  const filtered = modeFiltered.filter(s => {
    if (filter !== 'All' && s.disp !== filter) return false;
    if (search && !`${s.date} ${s.param} ${s.method} ${s.source}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function handleExport() {
    exportCsv(
      filtered.map(s => ({ Date: s.date, Parameter: s.param, Method: s.method, Value: s.value, Unit: s.unit, Source: s.source, Disposition: s.disp })),
      `upstream_lab-samples_${new Date().toISOString().slice(0, 10)}.csv`
    );
    showToast(`Exported ${filtered.length} samples to CSV`);
  }

  const filters: { key: FilterKey; count: number }[] = [
    { key: 'All', count: modeFiltered.length },
    { key: 'Reported', count: modeFiltered.filter(s => s.disp === 'Reported').length },
    { key: 'Held', count: modeFiltered.filter(s => s.disp === 'Held').length },
    { key: 'Excluded', count: modeFiltered.filter(s => s.disp === 'Excluded').length },
    { key: 'QC', count: modeFiltered.filter(s => s.disp === 'QC').length },
  ];

  // Disposition summary counts based on mode
  const dispCounts = {
    Reported: modeFiltered.filter(s => s.disp === 'Reported').length,
    Held: modeFiltered.filter(s => s.disp === 'Held').length,
    Excluded: modeFiltered.filter(s => s.disp === 'Excluded').length,
    Resampled: modeFiltered.filter(s => s.disp === 'Re-sampled').length,
    QC: modeFiltered.filter(s => s.disp === 'QC').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy tracking-tight">Lab <em className="font-serif italic font-bold">Samples</em></h1>
          <p className="text-sm text-text-dim mt-[3px]">Every sample collected — reported, held, excluded, re-sampled, QC. The audit trail behind the MOR and DMR.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="bg-surface border border-border-mid text-text-mid px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer">📥 Export CSV</button>
          <button onClick={() => showToast('Log Sample form coming soon')} className="bg-navy text-white px-3.5 py-[9px] rounded-lg text-sm font-semibold cursor-pointer border-none">＋ Log Sample</button>
        </div>
      </div>

      {/* Disposition summary */}
      <div className="grid grid-cols-5 gap-2.5 mb-3.5 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
        {[
          { label: 'Reported', value: dispCounts.Reported, note: 'Goes to DMR/MOR · permit-required', color: 'bg-green' },
          { label: 'Held', value: dispCounts.Held, note: 'Process control · not reported', color: 'bg-text-dim' },
          { label: 'Excluded', value: dispCounts.Excluded, note: 'Analytical anomaly · documented', color: 'bg-red' },
          { label: 'Re-sampled', value: dispCounts.Resampled, note: 'None this period', color: 'bg-[#d97706]' },
          { label: 'QC', value: dispCounts.QC, note: 'Lab QC · not reportable', color: 'bg-purple' },
        ].map(d => (
          <div key={d.label} className="bg-surface border border-border rounded-[10px] px-3.5 py-3 relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-[10px] ${d.color}`} />
            <div className="text-[9px] font-bold text-text-dim uppercase tracking-[1px] mb-1 mt-1.5">{d.label}</div>
            <div className="text-2xl font-bold text-navy font-mono tracking-tight leading-none">{d.value}</div>
            <div className="text-[10px] text-text-mid mt-[5px] leading-relaxed">{d.note}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-surface border border-border rounded-[10px] px-3.5 py-3 mb-3.5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-[14px] border cursor-pointer ${filter === f.key ? 'bg-navy text-white border-navy' : 'bg-surface text-text-mid border-border-mid hover:bg-bg'}`}
            >
              {f.key} {f.count}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-bg border border-border rounded-lg px-2.5 py-1.5">
          <span className="text-text-dim">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by parameter, date, or lab ID…"
            className="border-none bg-transparent flex-1 text-sm text-text-primary outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Date','Parameter','Value','Source','Disposition'].map(h => (
                <th key={h} className="bg-bg px-3 py-2.5 text-left text-[10px] font-bold text-text-dim uppercase tracking-[0.7px] border-b border-border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={i} className="cursor-pointer hover:bg-[#fafbfc]">
                <td className="px-3 py-3 border-b border-border"><span className="font-mono text-xs text-text-mid">{s.date}</span></td>
                <td className="px-3 py-3 border-b border-border">
                  <div className="font-semibold text-text-primary">{s.param}</div>
                  <div className="font-mono text-[10px] text-text-dim mt-px">{s.method}</div>
                </td>
                <td className="px-3 py-3 border-b border-border"><span className="font-mono font-semibold text-text-primary text-base">{s.value}<span className="text-[10px] text-text-dim font-normal ml-0.5">{s.unit}</span></span></td>
                <td className="px-3 py-3 border-b border-border"><span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-[3px] rounded-[5px] border ${s.sourceStyle}`}>{s.source}</span></td>
                <td className="px-3 py-3 border-b border-border"><span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-[3px] rounded-[14px] uppercase tracking-[0.4px] border ${s.dispStyle}`}>{s.disp}</span></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-8 text-center text-sm text-text-dim">No samples match your filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3.5 text-xs text-text-dim leading-relaxed">
        The journal is the source of truth for what we collected — the DMR pulls only &quot;Reported&quot; rows. Click any row to see the source, the method, the operator who logged it, and the reason behind its disposition. <em>This is what an inspector would walk through.</em>
      </div>
    </div>
  );
}
