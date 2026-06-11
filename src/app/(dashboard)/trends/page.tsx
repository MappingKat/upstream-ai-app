'use client';

import { ModeVisible } from '@/components/ui/ModeVisible';
import { exportPdfViaPrint } from '@/lib/export';

export default function TrendsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy tracking-tight"><em className="font-serif italic font-bold">Trends</em></h1>
          <p className="text-sm text-text-dim mt-[3px]">12-month parameter histories · MOR + DMR running averages · permit margin tracking</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportPdfViaPrint('12-Month Trends — Town of Alma')} className="bg-surface border border-border-mid text-text-mid px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer">↓ Export</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5 mb-3.5 max-[900px]:grid-cols-1">
        {/* Cl₂ */}
        <ModeVisible show="dw">
          <div className="bg-surface border border-border rounded-xl p-4 px-[18px]">
            <div className="text-sm font-bold text-navy mb-1.5">Cl₂ residual — 12 months</div>
            <div className="text-[10px] text-text-mid mb-2">Monthly lowest reading · permit min 0.2 mg/L</div>
            <svg viewBox="0 0 400 120" className="w-full h-[120px]" xmlns="http://www.w3.org/2000/svg">
              <line x1="30" y1="100" x2="390" y2="100" stroke="#cbd5e1" strokeWidth="1"/>
              <line x1="30" y1="90" x2="390" y2="90" stroke="#dc2626" strokeWidth="1" strokeDasharray="3,2"/>
              <text x="395" y="93" fontFamily="DM Mono" fontSize="9" fill="#dc2626">0.2</text>
              <polyline points="40,30 70,32 100,30 130,28 160,35 190,42 220,50 250,55 280,60 310,68 340,76 370,82" fill="none" stroke="#1b6a8a" strokeWidth="2"/>
              <text x="40" y="115" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#64748b">Apr</text>
              <text x="370" y="115" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#64748b">Mar</text>
            </svg>
            <div className="text-[10px] text-yellow mt-1.5 leading-relaxed"><strong>↓ Declining trend</strong> — margin to permit limit has tightened from 75% to 30% over 12 months.</div>
          </div>
        </ModeVisible>

        {/* BOD₅ */}
        <ModeVisible show="ww">
          <div className="bg-surface border border-border rounded-xl p-4 px-[18px]">
            <div className="text-sm font-bold text-navy mb-1.5">BOD₅ — 12 months</div>
            <div className="text-[10px] text-text-mid mb-2">Monthly average · permit max 30 mg/L</div>
            <svg viewBox="0 0 400 120" className="w-full h-[120px]" xmlns="http://www.w3.org/2000/svg">
              <line x1="30" y1="100" x2="390" y2="100" stroke="#cbd5e1" strokeWidth="1"/>
              <line x1="30" y1="20" x2="390" y2="20" stroke="#dc2626" strokeWidth="1" strokeDasharray="3,2"/>
              <text x="395" y="23" fontFamily="DM Mono" fontSize="9" fill="#dc2626">30</text>
              <polyline points="40,72 70,68 100,70 130,75 160,72 190,68 220,70 250,74 280,72 310,70 340,76 370,72" fill="none" stroke="#16a34a" strokeWidth="2"/>
              <text x="40" y="115" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#64748b">Apr</text>
              <text x="370" y="115" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#64748b">Mar</text>
            </svg>
            <div className="text-[10px] text-green mt-1.5 leading-relaxed"><strong>↔ Stable</strong> — averaging 18–20 mg/L all year. Plant performing consistently.</div>
          </div>
        </ModeVisible>

        {/* TSS */}
        <ModeVisible show="ww">
          <div className="bg-surface border border-border rounded-xl p-4 px-[18px]">
            <div className="text-sm font-bold text-navy mb-1.5">TSS — 12 months</div>
            <div className="text-[10px] text-text-mid mb-2">Monthly average · permit max 45 mg/L</div>
            <svg viewBox="0 0 400 120" className="w-full h-[120px]" xmlns="http://www.w3.org/2000/svg">
              <line x1="30" y1="100" x2="390" y2="100" stroke="#cbd5e1" strokeWidth="1"/>
              <line x1="30" y1="15" x2="390" y2="15" stroke="#dc2626" strokeWidth="1" strokeDasharray="3,2"/>
              <text x="395" y="18" fontFamily="DM Mono" fontSize="9" fill="#dc2626">45</text>
              <polyline points="40,82 70,80 100,84 130,78 160,82 190,84 220,80 250,82 280,78 310,82 340,84 370,80" fill="none" stroke="#16a34a" strokeWidth="2"/>
              <text x="40" y="115" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#64748b">Apr</text>
              <text x="370" y="115" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#64748b">Mar</text>
            </svg>
            <div className="text-[10px] text-green mt-1.5 leading-relaxed"><strong>↔ Stable</strong> — averaging 11–14 mg/L. Healthy margin to limit.</div>
          </div>
        </ModeVisible>

        {/* Flow */}
        <ModeVisible show="ww">
          <div className="bg-surface border border-border rounded-xl p-4 px-[18px]">
            <div className="text-sm font-bold text-navy mb-1.5">Effluent flow — 12 months</div>
            <div className="text-[10px] text-text-mid mb-2">Monthly average · SCADA · report-only</div>
            <svg viewBox="0 0 400 120" className="w-full h-[120px]" xmlns="http://www.w3.org/2000/svg">
              <line x1="30" y1="100" x2="390" y2="100" stroke="#cbd5e1" strokeWidth="1"/>
              <polyline points="40,75 70,68 100,60 130,55 160,50 190,60 220,72 250,78 280,82 310,78 340,72 370,68" fill="none" stroke="#1b6a8a" strokeWidth="2"/>
              <text x="40" y="115" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#64748b">Apr</text>
              <text x="370" y="115" textAnchor="middle" fontFamily="DM Mono" fontSize="9" fill="#64748b">Mar</text>
            </svg>
            <div className="text-[10px] text-text-mid mt-1.5 leading-relaxed"><strong>Seasonal pattern</strong> — peaks in summer (tourist load), 0.08–0.14 MGD range.</div>
          </div>
        </ModeVisible>
      </div>
    </div>
  );
}
