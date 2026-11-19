'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  FolderArchive,
  ArrowLeft,
  UploadCloud,
  FileText,
  Trash2,
  Sparkles,
  Download,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { NextSaaSBtn, Badge } from '@simplifypdf/ui';

export default function BatchStudioPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [action, setAction] = useState('COMPRESS');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const array = Array.from(newFiles);
    setFiles((prev) => [...prev, ...array]);
    setIsCompleted(false);
  };

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const startBatch = () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {/* Top Header */}
      <header className="border-b border-[var(--line)] bg-[var(--card)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)]">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="text-xs text-[var(--muted)]">/</span>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">PRO Batch Studio</span>
        </div>
        <Badge variant="pro">2GB CAPACITOR ACTIVE</Badge>
      </header>

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col gap-8">
        <div className="text-center flex flex-col items-center gap-2">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-[var(--ink)]">
            PRO Multi-File Batch Processor
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)] max-w-lg">
            Upload up to 100 documents at once. Process in parallel through permissive open-source engines and download a single consolidated ZIP archive.
          </p>
        </div>

        {/* Action Select & Drop Zone */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--card)] border border-[var(--line)]">
            <span className="text-sm font-bold text-[var(--ink)]">Target Batch Action:</span>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold text-[var(--ink)]"
            >
              <option value="COMPRESS">Compress all files (Max reduction)</option>
              <option value="WORD">Convert all to Word (.docx)</option>
              <option value="MERGE">Merge all into single master document</option>
              <option value="IMAGES">Export all pages as JPG ZIP</option>
            </select>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[var(--line)] hover:border-[var(--primary-500)] rounded-3xl p-10 bg-[var(--card)] text-center cursor-pointer transition-colors shadow-sm"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary-50)] text-[var(--primary-500)] flex items-center justify-center">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-black text-xl text-[var(--ink)]">
                Drop multiple files or folders here
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Supports up to 100 files, maximum 2GB combined size
              </p>
              <div className="mt-2">
                <NextSaaSBtn text="Select Multiple Files" variant="primary" size="md" />
              </div>
            </div>
          </div>
        </div>

        {/* Staged File List */}
        {files.length > 0 && (
          <div className="rounded-3xl bg-[var(--card)] border border-[var(--line)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-black text-lg text-[var(--ink)]">
                Staged Documents ({files.length})
              </h3>
              <button
                onClick={() => setFiles([])}
                className="text-xs font-bold text-rose-500 hover:underline"
              >
                Clear all
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-[var(--line)]">
              {files.map((f, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[var(--primary-500)]" />
                    <span className="text-xs font-semibold text-[var(--ink)]">{f.name}</span>
                    <span className="text-[11px] text-[var(--muted)]">({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--line)] flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--muted)]">
                Total size: {(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB
              </span>

              {!isCompleted ? (
                <button
                  onClick={startBatch}
                  disabled={isProcessing}
                  className="px-6 py-3 rounded-2xl bg-[var(--primary-500)] text-white font-bold text-xs hover:bg-[var(--primary-700)] transition-all flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Processing Batch Queue...</span>
                    </>
                  ) : (
                    <span>Execute Batch ({files.length} Files) →</span>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Ready!
                  </span>
                  <button
                    onClick={() => alert('Downloading batch_results.zip')}
                    className="px-6 py-3 rounded-2xl bg-[var(--secondary)] text-white font-bold text-xs hover:bg-black transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>Download Consolidated ZIP</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
