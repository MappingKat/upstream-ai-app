'use client';

import { ModeVisible } from '@/components/ui/ModeVisible';
import { showToast } from '@/lib/export';

export function ForecastChart() {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 px-5 mb-3.5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3.5 flex-wrap gap-3">
        <div>
          <div className="text-sm font-bold text-navy uppercase tracking-[0.8px] flex items-center gap-2">
            6-month trend + 8-week forecast
            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-[3px] rounded-[14px] bg-purple-bg text-purple border border-purple/[0.22] uppercase tracking-[0.5px]">
              ⚡ Predictive
            </span>
          </div>
          <div className="text-[10px] text-text-dim font-mono mt-1">
            Oct 2025 — May 2026 · % headroom to permit limit · forecast uses 6-month regression + seasonal adjustment
          </div>
        </div>
        <button onClick={() => showToast('Work order created: Inspect chlorinator feed pump — due within 7 days')} className="px-3.5 py-2.5 bg-red text-white border-none rounded-lg text-xs font-bold cursor-pointer uppercase tracking-[0.5px] min-h-[40px] inline-flex items-center gap-1.5 hover:bg-[#991b1b]">
          🔧 Create work order: inspect chlorinator
        </button>
      </div>

      {/* SVG Chart */}
      <svg className="w-full h-[140px] block" viewBox="0 0 720 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        {/* Violation zone */}
        <rect x="540" y="120" width="170" height="32" fill="#b91c1c" fillOpacity="0.10" />
        <text x="625" y="148" textAnchor="middle" fontFamily="Inter" fontSize="8" fill="#b91c1c" fontWeight="700" letterSpacing="0.5">↓ BELOW PERMIT LIMIT ↓</text>

        {/* Forecast region */}
        <rect x="535" y="20" width="175" height="100" fill="#f5f3ff" fillOpacity="0.5" />
        <line x1="535" y1="18" x2="535" y2="122" stroke="#a78bfa" strokeWidth="1" strokeDasharray="1,3" />
        <text x="538" y="28" fontFamily="Inter" fontSize="8" fill="#6d28d9" fontWeight="700" letterSpacing="0.5">FORECAST →</text>

        {/* Gridlines */}
        <line x1="40" y1="20" x2="710" y2="20" stroke="#e2e8f0" strokeWidth="0.5" />
        <line x1="40" y1="55" x2="710" y2="55" stroke="#e2e8f0" strokeWidth="0.5" />
        <line x1="40" y1="90" x2="710" y2="90" stroke="#e2e8f0" strokeWidth="0.5" />
        <line x1="40" y1="120" x2="710" y2="120" stroke="#b91c1c" strokeWidth="1.5" strokeDasharray="3,2" />

        {/* Y-axis labels */}
        <text x="32" y="24" textAnchor="end" fontFamily="DM Mono" fontSize="9" fill="#94a3b8">100%</text>
        <text x="32" y="59" textAnchor="end" fontFamily="DM Mono" fontSize="9" fill="#94a3b8">75%</text>
        <text x="32" y="94" textAnchor="end" fontFamily="DM Mono" fontSize="9" fill="#94a3b8">50%</text>
        <text x="32" y="124" textAnchor="end" fontFamily="DM Mono" fontSize="9" fill="#b91c1c" fontWeight="700">LIMIT</text>

        {/* X-axis labels */}
        <text x="80" y="135" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#64748b">Oct</text>
        <text x="170" y="135" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#64748b">Nov</text>
        <text x="260" y="135" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#64748b">Dec</text>
        <text x="350" y="135" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#64748b">Jan</text>
        <text x="440" y="135" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#64748b">Feb</text>
        <text x="530" y="135" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#64748b" fontWeight="700">Mar</text>
        <text x="620" y="135" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#6d28d9">Apr</text>
        <text x="700" y="135" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#6d28d9">May</text>

        {/* Cl₂ confidence band */}
        <polygon points="530,95 620,108 700,123 700,138 620,118 530,95" fill="#1b6a8a" fillOpacity="0.12" />

        {/* Cl₂ historical */}
        <polyline points="80,38 170,42 260,48 350,58 440,75 530,95" fill="none" stroke="#1b6a8a" strokeWidth="2.5" />
        {[80,170,260,350,440,530].map((x, i) => (
          <circle key={`cl-h-${i}`} cx={x} cy={[38,42,48,58,75,95][i]} r="3" fill="#1b6a8a" />
        ))}
        {/* Cl₂ forecast */}
        <polyline points="530,95 620,113 700,131" fill="none" stroke="#1b6a8a" strokeWidth="2.5" strokeDasharray="5,3" />
        <circle cx="620" cy="113" r="3" fill="#fff" stroke="#1b6a8a" strokeWidth="2" />
        <circle cx="700" cy="131" r="3" fill="#fff" stroke="#1b6a8a" strokeWidth="2" />

        {/* Crossing-point annotation */}
        <circle cx="657" cy="120" r="5" fill="#b91c1c" stroke="#fff" strokeWidth="2" />
        <line x1="657" y1="115" x2="657" y2="48" stroke="#b91c1c" strokeWidth="1" strokeDasharray="2,2" />
        <rect x="608" y="36" width="98" height="14" fill="#fff" stroke="#b91c1c" strokeWidth="1" rx="2" />
        <text x="657" y="46" textAnchor="middle" fontFamily="Inter" fontSize="8.5" fill="#b91c1c" fontWeight="700">Crossing ~Apr 22</text>

        {/* BOD₅ historical */}
        <polyline points="80,38 170,40 260,42 350,40 440,44 530,40" fill="none" stroke="#7c3aed" strokeWidth="2" />
        {[80,170,260,350,440,530].map((x, i) => (
          <circle key={`bod-${i}`} cx={x} cy={[38,40,42,40,44,40][i]} r="3" fill="#7c3aed" />
        ))}
        <polyline points="530,40 620,42 700,41" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5,3" strokeOpacity="0.7" />

        {/* TSS historical */}
        <polyline points="80,30 170,32 260,28 350,32 440,30 530,32" fill="none" stroke="#a16207" strokeWidth="2" />
        {[80,170,260,350,440,530].map((x, i) => (
          <circle key={`tss-${i}`} cx={x} cy={[30,32,28,32,30,32][i]} r="3" fill="#a16207" />
        ))}
        <polyline points="530,32 620,33 700,33" fill="none" stroke="#a16207" strokeWidth="2" strokeDasharray="5,3" strokeOpacity="0.7" />

        {/* TDS historical */}
        <polyline points="80,22 170,25 260,22 350,28 440,24 530,26" fill="none" stroke="#16a34a" strokeWidth="2" />
        {[80,170,260,350,440,530].map((x, i) => (
          <circle key={`tds-${i}`} cx={x} cy={[22,25,22,28,24,26][i]} r="3" fill="#16a34a" />
        ))}
        <polyline points="530,26 620,27 700,27" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="5,3" strokeOpacity="0.7" />

        {/* Mar Cl₂ callout */}
        <text x="510" y="92" textAnchor="end" fontFamily="Inter" fontSize="9" fill="#1b6a8a" fontWeight="700">30% today</text>
      </svg>

      {/* Legend + confidence */}
      <div className="flex justify-between items-center mt-2.5 flex-wrap gap-2">
        <div className="flex gap-3.5 text-[10px] text-text-mid">
          <ModeVisible show="dw">
            <span className="flex items-center gap-[5px]">
              <span className="w-[9px] h-[9px] rounded-[2px] bg-accent" />Cl₂ (DW)
            </span>
          </ModeVisible>
          <ModeVisible show="ww">
            <span className="flex items-center gap-[5px]">
              <span className="w-[9px] h-[9px] rounded-[2px] bg-[#7c3aed]" />BOD₅ (WW)
            </span>
          </ModeVisible>
          <ModeVisible show="ww">
            <span className="flex items-center gap-[5px]">
              <span className="w-[9px] h-[9px] rounded-[2px] bg-yellow" />TSS (WW)
            </span>
          </ModeVisible>
          <ModeVisible show="dw">
            <span className="flex items-center gap-[5px]">
              <span className="w-[9px] h-[9px] rounded-[2px] bg-green" />TDS (DW)
            </span>
          </ModeVisible>
        </div>
        <div className="text-[10px] text-text-mid font-mono flex gap-3.5 flex-wrap">
          <span>━ Actual</span>
          <span style={{ letterSpacing: '1px' }}>┄ ┄ Forecast</span>
          <span>▒ 80% confidence band</span>
        </div>
      </div>

      {/* Callout */}
      <div className="bg-red-bg border border-red-border rounded-[9px] p-[10px_13px] mt-3 text-xs text-text-primary leading-relaxed flex items-start gap-[9px]">
        <span className="text-[14px] text-red shrink-0 mt-px">⚠</span>
        <div>
          <strong className="text-red">Predicted permit violation:</strong> Cl₂ residual margin is projected to cross the 0.2 mg/L permit limit on or about <strong className="text-red">Apr 19–24, 2026</strong> (80% confidence). Margin has dropped from 80% headroom in Oct to 30% today — a steady 12%/month decline. BOD₅, TSS, and TDS forecasts remain stable at 65–80% headroom. <strong className="text-red">Recommended:</strong> chlorinator feed-pump inspection within the next 7 days to prevent violation before the April reading window.
        </div>
      </div>
    </div>
  );
}
