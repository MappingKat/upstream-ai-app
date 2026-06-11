'use client';

import { useState } from 'react';
import { showToast } from '@/lib/export';
import { UploadModal } from '@/components/documents/UploadModal';

const facilityDocs = [
  { icon: '📄', iconStyle: 'bg-red/[0.08] text-red', name: 'CDPS General Permit COG591177', meta: 'PDF · 18 pages · uploaded Jan 14, 2024' },
  { icon: '📄', iconStyle: 'bg-red/[0.08] text-red', name: 'PWS Construction Permit · CO0147001', meta: 'PDF · 6 pages · uploaded Feb 2022' },
  { icon: '📋', iconStyle: 'bg-accent/[0.08] text-accent', name: 'Bear Creek Lagoon SOP — Sampling', meta: 'DOCX · last edited Bobby J. · Feb 8, 2026' },
  { icon: '📋', iconStyle: 'bg-accent/[0.08] text-accent', name: 'Chlorinator O&M Manual', meta: 'PDF · 42 pages · uploaded Mar 2023' },
  { icon: '📄', iconStyle: 'bg-red/[0.08] text-red', name: 'CAL Apr 10 hold-time violation letter', meta: 'PDF · 1 page · Bobby uploaded Apr 11' },
  { icon: '📊', iconStyle: 'bg-green/10 text-green', name: '2025 Annual Wastewater Report — submitted', meta: 'XLSX · CDPHE format · submitted Mar 31, 2026' },
  { icon: '🗺️', iconStyle: 'bg-accent/[0.08] text-accent', name: 'Outfall 001A location + photos', meta: 'PDF · GPS coords + 6 photos · Aug 2023' },
  { icon: '🎓', iconStyle: 'bg-accent/[0.08] text-accent', name: 'Bobby — Class D wastewater cert', meta: 'PDF · expires Sep 15, 2026 · renewal CEUs needed' },
];

const globalRefs = [
  { name: 'CDPHE Reg 11 — Drinking Water', meta: '5 CCR 1002-11 · indexed by section' },
  { name: 'CDPHE Reg 61 — Discharge Permits', meta: '5 CCR 1002-61 · §V.A.7 sample exclusion' },
  { name: 'CDPHE Reg 85 — Nutrient Mgmt', meta: '5 CCR 1002-85 · effective May 2022' },
  { name: 'EPA NODI codes reference', meta: 'NetDMR standard · 9 codes indexed' },
  { name: 'Standard Methods 23rd ed.', meta: 'SM 5210-B · 2540-D · 4500-NH3-G · indexed' },
  { name: 'CDPHE MOR Submission Guide', meta: '2025 · wqcdcompliance.com workflows' },
];

export default function DocumentsPage() {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy tracking-tight"><em className="font-serif italic font-bold">Documents</em></h1>
          <p className="text-sm text-text-dim mt-[3px]">Facility records · permit copies · CDPHE references · all searchable, all indexed for AI</p>
        </div>
        <button onClick={() => setUploadOpen(true)} className="bg-navy text-white px-3.5 py-[9px] rounded-lg text-sm font-semibold cursor-pointer border-none">+ Upload</button>
      </div>

      {/* Search toolbar */}
      <div className="bg-surface border border-border rounded-xl px-4 py-3 mb-3.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex-1 flex items-center gap-2 bg-bg border border-border rounded-lg px-2.5 py-[7px] min-w-[200px]">
          <span className="text-text-dim">🔍</span>
          <input type="text" placeholder="Search documents — permit clauses, SOP titles, sample IDs…" className="border-none bg-transparent flex-1 text-sm text-text-primary outline-none" />
        </div>
        <div className="text-[10px] text-text-dim font-mono">28 documents · indexed for Ask Upstream</div>
      </div>

      {/* Facility Documents */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden mb-3.5">
        <div className="px-[18px] py-[13px] bg-bg border-b border-border flex items-center gap-2.5">
          <div className="text-sm font-bold text-navy uppercase tracking-[0.8px]">Facility Documents</div>
          <span className="font-mono text-[10px] text-text-dim bg-surface border border-border px-[7px] py-[2px] rounded-[10px]">12</span>
        </div>
        <div className="grid grid-cols-2 max-[700px]:grid-cols-1">
          {facilityDocs.map((doc, i) => (
            <div key={i} className="flex items-center gap-3 px-[18px] py-[13px] border-r border-b border-border cursor-pointer hover:bg-[#fafbfc] even:border-r-0">
              <div className={`w-9 h-9 rounded-[7px] flex items-center justify-center text-[15px] shrink-0 ${doc.iconStyle}`}>{doc.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-primary leading-tight">{doc.name}</div>
                <div className="text-[10px] text-text-dim font-mono mt-0.5">{doc.meta}</div>
              </div>
              <button onClick={() => showToast('Document viewer coming soon')} className="px-2 py-[5px] bg-transparent border border-border rounded-[5px] text-text-mid text-[11px] hover:bg-bg cursor-pointer">View</button>
            </div>
          ))}
        </div>
      </div>

      {/* Global References */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-[18px] py-[13px] bg-bg border-b border-border flex items-center gap-2.5">
          <div className="text-sm font-bold text-navy uppercase tracking-[0.8px]">Global References</div>
          <span className="font-mono text-[10px] text-text-dim bg-surface border border-border px-[7px] py-[2px] rounded-[10px]">16</span>
        </div>
        <div className="grid grid-cols-2 max-[700px]:grid-cols-1">
          {globalRefs.map((doc, i) => (
            <div key={i} className="flex items-center gap-3 px-[18px] py-[13px] border-r border-b border-border cursor-pointer hover:bg-[#fafbfc] even:border-r-0">
              <div className="w-9 h-9 rounded-[7px] bg-purple-bg text-purple flex items-center justify-center text-[15px] shrink-0">📚</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-primary leading-tight">{doc.name}</div>
                <div className="text-[10px] text-text-dim font-mono mt-0.5">{doc.meta}</div>
              </div>
              <button onClick={() => showToast('Document viewer coming soon')} className="px-2 py-[5px] bg-transparent border border-border rounded-[5px] text-text-mid text-[11px] hover:bg-bg cursor-pointer">View</button>
            </div>
          ))}
        </div>
      </div>
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={() => showToast('Document indexed for AI search')}
      />
    </div>
  );
}
