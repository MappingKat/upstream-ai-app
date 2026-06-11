'use client';

import { useState, useRef } from 'react';
import { showToast } from '@/lib/export';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
}

const docTypes = [
  { value: 'permit', label: 'Permit' },
  { value: 'sop', label: 'SOP / Procedure' },
  { value: 'om_manual', label: 'O&M Manual' },
  { value: 'lab_letter', label: 'Lab Letter' },
  { value: 'certification', label: 'Certification' },
  { value: 'report', label: 'Report' },
  { value: 'reference', label: 'Reference' },
];

export function UploadModal({ open, onClose, onUploaded }: UploadModalProps) {
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('permit');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  async function handleUpload() {
    if (!file || !title.trim()) return;
    setUploading(true);

    try {
      // Convert file to base64
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');

      const res = await fetch('/api/upload-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          docType,
          file: {
            name: file.name,
            type: file.type,
            size: file.size,
            base64,
          },
        }),
      });

      if (res.ok) {
        showToast(`"${title}" uploaded — processing for AI search`);
        setTitle('');
        setFile(null);
        onUploaded();
        onClose();
      } else {
        const data = await res.json();
        showToast(`Upload failed: ${data.error || 'Unknown error'}`);
      }
    } catch {
      showToast('Upload failed — check your connection');
    }

    setUploading(false);
  }

  return (
    <div className="fixed inset-0 z-[300] bg-navy-dark/55 flex items-center justify-center p-6 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-surface rounded-xl max-w-md w-full shadow-[0_24px_60px_rgba(0,0,0,0.30)] overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-border">
          <h2 className="text-lg font-semibold text-navy">Upload document</h2>
          <p className="text-xs text-text-mid mt-1">PDF or DOCX — will be indexed for AI search automatically.</p>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-mid mb-1.5">Document title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. CDPS General Permit COG591177"
              className="w-full px-3 py-2.5 border-[1.5px] border-border-mid rounded-lg text-sm text-text-primary bg-surface outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-mid mb-1.5">Document type</label>
            <select
              value={docType}
              onChange={e => setDocType(e.target.value)}
              className="w-full px-3 py-2.5 border-[1.5px] border-border-mid rounded-lg text-sm text-text-primary bg-surface outline-none focus:border-accent"
            >
              {docTypes.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-mid mb-1.5">File (PDF or DOCX)</label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full py-6 border-2 border-dashed border-border-mid rounded-lg text-sm text-text-mid cursor-pointer hover:border-accent hover:text-accent hover:bg-accent/[0.04] transition-all text-center"
            >
              {file ? (
                <span className="text-text-primary font-semibold">{file.name} <span className="text-text-dim font-normal">({(file.size / 1024).toFixed(0)} KB)</span></span>
              ) : (
                'Click to select file'
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-surface border border-border-mid text-text-mid rounded-lg text-sm font-semibold cursor-pointer">Cancel</button>
          <button
            onClick={handleUpload}
            disabled={!file || !title.trim() || uploading}
            className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-bold cursor-pointer border-none hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload & process'}
          </button>
        </div>
      </div>
    </div>
  );
}
