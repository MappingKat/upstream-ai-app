'use client';

import { showToast } from '@/lib/export';

const suggestions = [
  { tag: 'Compliance', text: 'What was our lowest Cl₂ residual last quarter, and how close did we get to violating?' },
  { tag: 'Regulatory', text: 'Does Reg 61 allow excluding a sample for hold-time violation?' },
  { tag: 'Trend', text: 'Is our BOD₅ trending up over the last 6 months?' },
  { tag: 'Procedure', text: 'Walk me through what happens if Cl₂ drops below 0.2 mg/L.' },
];

export default function AskPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy tracking-tight">Ask <em className="font-serif italic font-bold">Upstream</em></h1>
          <p className="text-sm text-text-dim mt-[3px]">Compliance assistant · trained on your permits, SOPs, and 18 months of plant data</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => showToast('Chat history coming soon')} className="bg-surface border border-border-mid text-text-mid px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer">📜 History</button>
          <button onClick={() => showToast('New thread started')} className="bg-surface border border-border-mid text-text-mid px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer">+ New thread</button>
        </div>
      </div>

      <div className="max-w-[880px]">
        {/* Hero */}
        <div className="bg-gradient-to-br from-navy to-navy-light rounded-[14px] px-7 py-6 text-white mb-3.5">
          <div className="text-lg font-semibold tracking-tight">What can I help you understand today, <em className="font-serif italic text-water">Bobby</em>?</div>
          <div className="text-sm text-white/85 mt-1.5 leading-relaxed">I have access to all of Alma&apos;s facility documents (permits, SOPs, lab letters), CDPHE regulations (Reg 11, 61, 85), and 18 months of your plant data. I&apos;ll show you exactly where my answers come from.</div>
        </div>

        {/* Suggestions */}
        <div className="bg-surface border border-border rounded-xl p-4 px-[18px] mb-3.5">
          <div className="text-[10px] font-bold text-text-dim uppercase tracking-[1px] mb-2.5">Suggested questions</div>
          <div className="grid grid-cols-2 gap-2 max-[600px]:grid-cols-1">
            {suggestions.map(s => (
              <button key={s.tag} onClick={() => showToast('AI chat requires Claude API integration (Phase 6)')} className="p-2.5 px-3.5 bg-bg border border-border rounded-[9px] text-xs text-text-primary cursor-pointer text-left leading-relaxed hover:bg-accent/[0.06] hover:border-accent hover:text-accent transition-all">
                <span className="block text-[9px] font-bold text-text-dim uppercase tracking-[0.5px] mb-[3px]">{s.tag}</span>
                {s.text}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation */}
        <div className="bg-surface border border-border rounded-xl p-[18px_22px] mb-3.5">
          {/* User message */}
          <div className="flex gap-3 mb-[18px]">
            <div className="w-8 h-8 rounded-full bg-bg text-text-primary border border-border flex items-center justify-center text-[13px] font-bold shrink-0">B</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-text-dim uppercase tracking-[0.7px] mb-1">Bobby · Operator</div>
              <div className="text-sm text-text-primary">Why was the Apr 10 BOD₅ sample excluded from the DMR?</div>
            </div>
          </div>

          {/* AI response */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-water text-navy-dark flex items-center justify-center text-[13px] font-bold shrink-0">U</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-text-dim uppercase tracking-[0.7px] mb-1">Upstream AI</div>
              <div className="text-sm text-text-primary leading-relaxed space-y-2">
                <p>The Apr 10 BOD₅ sample (Lab ID 26-04-0198, result 47 mg/L) was excluded from the March DMR monthly average because the sample bottle exceeded its 48-hour critical hold time before lab analysis.</p>
                <p>Specifically: <strong className="text-navy">the sample was collected at 07:40 on Apr 10 and analyzed at 11:25 on Apr 12 — a 52-hour elapsed hold time</strong> against the 48-hour SM 5210-B limit. Colorado Analytical issued a formal re-pull notice on Apr 11 invalidating the result.</p>
                <p>The exclusion is permitted under <strong className="text-navy">CDPHE Reg 61 §V.A.7</strong>, which allows exclusion of samples with documented analytical or preservation violations as long as the exclusion is documented in the DMR cover note.</p>
                <p>The remaining 4 BOD₅ samples (16, 19, 20, 17 mg/L) average to <strong className="text-navy">18 mg/L</strong>, well within the 30 mg/L permit limit.</p>
              </div>
              <div className="mt-2.5 px-3 py-2.5 bg-bg border-l-[3px] border-accent rounded text-[11px] text-text-mid leading-relaxed">
                <div className="text-[9px] font-bold text-accent uppercase tracking-[0.7px] mb-[3px]">Sources</div>
                <div>• Lab Samples · 26-04-0198 (Apr 10 entry)</div>
                <div>• CDPHE Reg 61 §V.A.7 (sample exclusion language)</div>
                <div>• CAL hold-time letter (Documents · Apr 11)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="bg-surface border-[1.5px] border-border rounded-xl px-3 py-2.5 flex items-center gap-2.5 focus-within:border-accent focus-within:shadow-[0_0_0_3px_rgba(27,106,138,0.1)]">
          <input type="text" placeholder="Ask anything about your facility, permits, or compliance…" className="flex-1 border-none bg-transparent text-sm text-text-primary outline-none py-1.5" />
          <button onClick={() => showToast('AI chat requires Claude API integration (Phase 6)')} className="w-[34px] h-[34px] rounded-lg bg-navy text-white border-none cursor-pointer text-sm hover:bg-accent">→</button>
        </div>
        <div className="text-[10px] text-text-dim text-center mt-2 leading-relaxed">
          Answers cite specific documents and data points. Beta — verify regulatory citations against the published rule before acting.
        </div>
      </div>
    </div>
  );
}
