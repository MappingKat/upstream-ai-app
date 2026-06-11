'use client';

import { showToast } from '@/lib/export';

const integrationRows = [
  {
    icon: '⚡', iconStyle: 'bg-green/10 text-green', name: 'SCADA Exports', meta: '· Wonderware Historian v2024',
    sub: 'Continuous 5-minute resolution · flow, lagoon levels, plant-off events · authenticated via service account',
    status: 'healthy', statusLabel: '● Healthy',
    stats: [
      { label: 'Last sync', value: '0:02 ago · 07:34:18' },
      { label: 'Points today', value: '1,512 / day projected' },
      { label: 'Tags monitored', value: '17 active · 2 paused' },
      { label: 'Auth expires', value: 'Aug 14, 2026' },
    ],
    actions: ['Pull now'],
  },
  {
    icon: '🧪', iconStyle: 'bg-yellow-bg text-yellow', name: 'Lab Inbox', meta: '· Colorado Analytical · IMAP / PDF parser',
    sub: 'Watches the lab-results@town-of-alma.co inbox · auto-parses CAL PDF returns into the Lab Samples database',
    status: 'warn', statusLabel: '⚠ Degraded · slow returns',
    stats: [
      { label: 'Last return', value: '18 h ago · Apr 2 1:42 PM', warn: true as const },
      { label: 'Pending', value: '2 samples · CAL acknowledged' },
      { label: 'Avg turnaround', value: '28 h (vs 14 h normal)' },
      { label: 'Auth expires', value: 'Never (app password)' },
    ],
    actions: ['Pull now', 'Reconnect'],
    issue: 'Colorado Analytical\'s turnaround time has increased from ~14 hr to ~28 hr over the past week. Two BOD₅ samples (Mar 27 pickup) are still awaiting return.',
    issueMeta: 'Next action: results expected by Apr 4 EOD per CAL acknowledgment.',
  },
  {
    icon: '📤', iconStyle: 'bg-green/10 text-green', name: 'CDPHE Portal', meta: '· wqcdcompliance.com · OAuth2',
    sub: 'Drinking-water MOR submission · authenticated as Gary Goettelman · Town Administrator + ORC',
    status: 'healthy', statusLabel: '● Healthy',
    stats: [
      { label: 'Last submission', value: 'Feb MOR · Mar 7, 2026' },
      { label: 'Auth method', value: 'OAuth2 · Gary G.' },
      { label: 'Token expires', value: 'Jun 17, 2026 (75 d)' },
      { label: 'Submission count YTD', value: '3 (Jan/Feb MOR, Q4 CCR)' },
    ],
    actions: ['Test connection'],
  },
  {
    icon: '📤', iconStyle: 'bg-green/10 text-green', name: 'NetDMR', meta: '· EPA · CDX account · COG591177',
    sub: 'Wastewater DMR submission · authenticated as Gary Goettelman · CROMERR-compliant e-signature',
    status: 'healthy', statusLabel: '● Healthy',
    stats: [
      { label: 'Last submission', value: 'Feb DMR · Mar 26, 2026' },
      { label: 'Auth method', value: 'CDX · Gary G.' },
      { label: 'CDX session', value: 'Refreshes per submission' },
      { label: 'Submission count YTD', value: '3 DMRs' },
    ],
    actions: ['Test connection'],
  },
  {
    icon: '✉', iconStyle: 'bg-green/10 text-green', name: 'Email Notifications', meta: '· SendGrid · 3 recipients',
    sub: 'Compliance alerts · deadline reminders · gap warnings · weekly summary digest',
    status: 'healthy', statusLabel: '● Healthy',
    stats: [
      { label: 'Recipients', value: 'Gary · Bobby · Kat' },
      { label: 'Last alert', value: '2 d ago · Cl₂ low reading' },
      { label: 'Delivery rate', value: '100% · last 30 alerts' },
      { label: 'Frequency', value: 'Real-time + Mon digest' },
    ],
    actions: ['Send test'],
  },
];

export default function IntegrationsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy tracking-tight"><em className="font-serif italic font-bold">Integrations</em> &amp; system status</h1>
          <p className="text-sm text-text-dim mt-[3px]">All connections to external systems · health checks · last-sync history · self-serve recovery</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => showToast('Activity log coming soon')} className="bg-surface border border-border-mid text-text-mid px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer">📜 Activity log</button>
          <button onClick={() => showToast('Integration setup wizard coming soon')} className="bg-navy text-white px-3.5 py-[9px] rounded-lg text-sm font-semibold cursor-pointer border-none">＋ Add integration</button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-surface border border-border rounded-xl p-4 mb-3.5">
        <div className="grid grid-cols-4 gap-3.5 max-[700px]:grid-cols-2">
          {[
            { label: 'Healthy', value: '4', color: 'text-green', note: 'SCADA · CDPHE · NetDMR · Email' },
            { label: 'Degraded', value: '1', color: 'text-yellow', note: 'Lab inbox · slow returns' },
            { label: 'Down', value: '0', color: 'text-red', note: 'No connections offline' },
            { label: 'Last health check', value: '07:34 AM', color: 'text-text-primary', note: 'Auto · every 5 min', small: true },
          ].map(s => (
            <div key={s.label}>
              <div className="text-[9px] font-bold text-text-dim uppercase tracking-[1px] mb-1">{s.label}</div>
              <div className={`font-mono font-bold tracking-tight leading-none ${s.color} ${s.small ? 'text-md mt-[5px]' : 'text-2xl'}`}>{s.value}</div>
              <div className="text-[10px] text-text-mid mt-[5px]">{s.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration rows */}
      <div className="grid grid-cols-1 gap-3.5">
        {integrationRows.map(integ => (
          <div key={integ.name} className={`bg-surface border rounded-xl overflow-hidden ${integ.status === 'warn' ? 'border-yellow-border' : 'border-border'}`}>
            <div className={`px-5 py-4 flex items-center gap-3.5 flex-wrap ${integ.status === 'warn' ? 'bg-gradient-to-r from-yellow-bg to-white' : ''}`}>
              <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center text-[18px] shrink-0 ${integ.iconStyle}`}>{integ.icon}</div>
              <div className="flex-1 min-w-[200px]">
                <div className="text-base font-bold text-navy">{integ.name} <span className="font-mono font-normal text-text-dim text-[11px] ml-2">{integ.meta}</span></div>
                <div className="text-[11px] text-text-mid mt-0.5 leading-relaxed">{integ.sub}</div>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <span className={`text-[11px] font-bold ${integ.status === 'warn' ? 'text-yellow' : 'text-green'}`}>{integ.statusLabel}</span>
                {integ.actions.map(a => (
                  <button key={a} onClick={() => showToast(`${a}: ${integ.name} — ${a === 'Pull now' ? 'syncing...' : a === 'Reconnect' ? 'reconnecting...' : a === 'Test connection' ? 'connection OK ✓' : 'test email sent ✓'}`)} className={`px-3.5 py-2 rounded-[7px] text-[11px] font-semibold cursor-pointer ${a === 'Reconnect' ? 'bg-navy text-white border-none' : 'bg-surface text-navy border-[1.5px] border-navy'}`}>{a}</button>
                ))}
              </div>
            </div>
            <div className="px-5 py-3.5 border-t border-border bg-[#fafbfc]">
              <div className="grid grid-cols-4 gap-3 max-[700px]:grid-cols-2">
                {integ.stats.map(s => (
                  <div key={s.label}>
                    <div className="text-[9px] font-bold text-text-dim uppercase tracking-[1px] mb-[3px]">{s.label}</div>
                    <div className={`font-mono text-xs font-semibold ${'warn' in s && s.warn ? 'text-yellow' : 'text-text-primary'}`}>{s.value}</div>
                  </div>
                ))}
              </div>
              {integ.issue && (
                <div className="mt-3 px-3.5 py-2.5 bg-surface border-l-[3px] border-yellow rounded-[5px] text-[11px] text-text-primary leading-relaxed">
                  <strong className="text-yellow">What&apos;s happening:</strong> {integ.issue}
                  {integ.issueMeta && <div className="font-mono text-[10px] text-text-dim mt-1.5">{integ.issueMeta}</div>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Escalation footer */}
      <div className="mt-[18px] px-[18px] py-3.5 bg-surface border border-dashed border-border-mid rounded-[10px] flex justify-between items-center flex-wrap gap-2">
        <div className="text-xs text-text-mid leading-relaxed">
          <strong className="text-navy">Need help?</strong> Most simple issues self-resolve with the buttons above. For persistent failures — escalate to Upstream support.
        </div>
        <button onClick={() => showToast('Opening support contact — support@getupstream.ai')} className="px-3.5 py-2 bg-surface text-red border-[1.5px] border-red rounded-[7px] text-[11px] font-bold cursor-pointer">📞 Contact Upstream support</button>
      </div>
    </div>
  );
}
