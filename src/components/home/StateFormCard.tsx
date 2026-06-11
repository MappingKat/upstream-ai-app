'use client';

import Link from 'next/link';
import { exportCsv, showToast } from '@/lib/export';

export function StateFormCard() {
  return (
    <div className="bg-surface border border-border rounded-[14px] p-[18px] mb-3.5 grid grid-cols-[1fr_200px] gap-5 items-center max-[768px]:grid-cols-1">
      {/* Left: Info */}
      <div>
        <div className="text-[9px] font-bold text-accent uppercase tracking-[1.5px]">
          📄 One-click compliance
        </div>
        <div className="text-xl font-semibold text-navy mt-1 tracking-tight leading-tight">
          March DMR — <em className="font-serif italic font-bold">CDPHE</em> form auto-filled
        </div>
        <div className="text-xs text-text-mid mt-1.5 leading-relaxed font-mono">
          CDPS Permit COG591177 · Form WQCD-DMR · 26 / 28 fields complete<br />
          EPA NetDMR-ready · routes to Colorado WQCD on submit
        </div>
        <div className="inline-flex items-center gap-1.5 mt-2.5 text-xs text-text-primary bg-bg px-2.5 py-[5px] rounded-[14px] border border-border">
          <span className="w-[7px] h-[7px] rounded-full bg-yellow" />
          2 gaps remaining · ready to review once resolved
        </div>
        <div className="mt-3.5 flex gap-2 flex-wrap">
          <Link
            href="/dmr-prep"
            className="px-[18px] py-[11px] bg-navy text-white rounded-[9px] text-sm font-bold hover:bg-accent no-underline inline-flex items-center min-h-[42px]"
          >
            📋 Review filled form
          </Link>
          <button onClick={() => showToast('NetDMR submission requires integration setup (Phase 8)')} className="px-3.5 py-2.5 bg-surface border-[1.5px] border-border-mid text-text-mid rounded-[9px] text-sm font-semibold cursor-pointer hover:bg-bg min-h-[42px]">
            ↗ Submit to NetDMR
          </button>
          <button onClick={() => {
            exportCsv([
              { Parameter: 'BOD₅ Monthly Avg', Value: '18', Unit: 'mg/L', Limit: '≤ 30', Status: 'PASS' },
              { Parameter: 'TSS Monthly Avg', Value: '12', Unit: 'mg/L', Limit: '≤ 45', Status: 'PASS' },
              { Parameter: 'Cl₂ Residual Min', Value: '0.26', Unit: 'mg/L', Limit: '≥ 0.2', Status: 'TIGHT' },
              { Parameter: 'Flow Avg', Value: '0.084', Unit: 'MGD', Limit: 'Report only', Status: 'REPORTED' },
              { Parameter: 'pH Range', Value: '7.4-7.9', Unit: 'SU', Limit: '6.5-9.0', Status: 'PASS' },
            ], 'upstream_DMR_March-2026.csv');
            showToast('DMR data exported to CSV');
          }} className="px-3 py-2 text-accent text-xs font-semibold cursor-pointer underline bg-transparent border-none">
            Download Excel for records
          </button>
        </div>
      </div>

      {/* Right: Form Preview */}
      <Link
        href="/dmr-prep"
        className="bg-gradient-to-b from-[#fafbfc] to-white border border-border-mid rounded-[9px] p-3.5 cursor-pointer transition-all hover:border-accent hover:shadow-lg relative no-underline block"
      >
        <div className="text-[8px] font-bold text-text-dim uppercase tracking-[1px] text-center mb-1.5">
          Form preview · pg 1
        </div>
        <div className="bg-surface border border-border rounded-[5px] px-2 py-2.5 h-[170px] flex flex-col gap-1 relative">
          <span className="absolute top-1.5 right-1.5 text-[7px] font-bold text-accent">CDPHE</span>
          <div className="h-[7px] bg-navy rounded-[2px] w-[55%] mb-[3px]" />
          <div className="h-[5px] bg-bg rounded-[2px] w-[88%]" />
          <div className="h-[5px] bg-bg rounded-[2px] w-[60%]" />
          <div className="h-[5px] rounded-[2px] w-[88%] bg-gradient-to-r from-accent from-70% to-bg to-70%" />
          <div className="h-[5px] rounded-[2px] w-[38%] bg-gradient-to-r from-accent from-70% to-bg to-70%" />
          <div className="h-[5px] rounded-[2px] w-[60%] bg-gradient-to-r from-accent from-70% to-bg to-70%" />
          <div className="h-[5px] rounded-[2px] w-[88%] bg-gradient-to-r from-accent from-70% to-bg to-70%" />
          <div className="h-[5px] bg-yellow-bg border border-dashed border-yellow rounded-[2px] w-[42%]" />
          <div className="h-[5px] rounded-[2px] w-[60%] bg-gradient-to-r from-accent from-70% to-bg to-70%" />
          <div className="h-[5px] rounded-[2px] w-[38%] bg-gradient-to-r from-accent from-70% to-bg to-70%" />
          <div className="h-[5px] bg-yellow-bg border border-dashed border-yellow rounded-[2px] w-[42%]" />
          <div className="h-[5px] rounded-[2px] w-[88%] bg-gradient-to-r from-accent from-70% to-bg to-70%" />
          <div className="h-[5px] rounded-[2px] w-[60%] bg-gradient-to-r from-accent from-70% to-bg to-70%" />
        </div>
        <div className="text-[9px] text-text-mid text-center mt-2 font-mono">
          2 gaps · 26 of 28 filled
        </div>
      </Link>
    </div>
  );
}
