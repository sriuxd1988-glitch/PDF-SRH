'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Trash2,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FolderArchive,
  Lock,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { NextSaaSBtn, Badge, ButtonV6 } from '@simplifypdf/ui';

interface BatchFile {
  id: string;
  file: File;
  name: string;
  size: number;
  status: 'queued' | 'processing' | 'done' | 'error';
  progress: number;
}

export function BatchUploader() {
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [action, setAction] = useState<'COMPRESS' | 'CONVERT' | 'PROTECT' | 'OCR'>('COMPRESS');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalBytes = files.reduce((acc, f) => acc + f.size, 0);
  const totalMb = (totalBytes / (1024 * 1024)).toFixed(1);
  const maxMb = 2048; // 2 GB

  const handleFilesAdded = (fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList);

    if (files.length + incoming.length > 100) {
      alert('Maximum 100 documents can be processed in a single batch.');
      return;
    }

    const newEntries: BatchFile[] = incoming.map((f, i) => ({
      id: `batch-${Date.now()}-${i}-${Math.random()}`,
      file: f,
      name: f.name,
      size: f.size,
      status: 'queued',
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newEntries]);
    setIsCompleted(false);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const runBatchProcessing = () => {
    if (files.length === 0) return;
    if (action === 'PROTECT' && !password) {
      alert('Please enter a master password to encrypt all batch files.');
      return;
    }

    setIsProcessing(true);
    setOverallProgress(10);

    // Simulate parallel workers processing individual files
    const interval = setInterval(() => {
      setOverallProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setFiles((current) => current.map((f) => ({ ...f, status: 'done', progress: 100 })));
          setIsProcessing(false);
          setIsCompleted(true);
          return 100;
        }
        const next = prev + 15;
        // Update per-file status
        setFiles((current) =>
          current.map((f, idx) => ({
            ...f,
            status: next > (idx / current.length) * 100 ? 'done' : 'processing',
            progress: Math.min(100, Math.round((next / 100) * 100)),
          }))
        );
        return next;
      });
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Batch Action Bar */}
      <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
            Batch Pipeline Action
          </span>
          <div className="flex flex-wrap gap-2 mt-1">
            {[
              { id: 'COMPRESS', label: 'Batch Compress (-60%)' },
              { id: 'CONVERT', label: 'Batch Convert to PDF' },
              { id: 'PROTECT', label: 'Batch AES-256 Protect' },
              { id: 'OCR', label: 'Batch Searchable PDF/A' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setAction(opt.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  action === opt.id
                    ? 'bg-[var(--primary-500)] text-white shadow-sm'
                    : 'bg-[var(--soft)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--line)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {action === 'PROTECT' && (
          <div className="w-full md:w-auto flex items-center gap-2">
            <Lock className="w-4 h-4 text-[var(--primary-500)] shrink-0" />
            <input
              type="password"
              placeholder="Batch encryption password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)] font-mono outline-none focus:border-[var(--primary-500)]"
            />
          </div>
        )}
      </div>

      {/* Multi-file Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFilesAdded(e.dataTransfer.files);
        }}
        className="p-10 rounded-3xl border-2 border-dashed border-[var(--line)] hover:border-[var(--primary-500)] bg-[var(--card)] text-center cursor-pointer transition-colors shadow-sm flex flex-col items-center gap-3"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFilesAdded(e.target.files)}
        />
        <div className="w-16 h-16 rounded-2xl bg-[var(--primary-50)] text-[var(--primary-500)] flex items-center justify-center">
          <FolderArchive className="w-8 h-8" />
        </div>
        <h3 className="font-heading font-black text-xl text-[var(--ink)]">
          Drop up to 100 files for batch processing
        </h3>
        <p className="text-xs text-[var(--muted)] max-w-md">
          Accepts PDF, DOCX, XLSX, PNG, and JPG. Multi-file parallel processing with consolidated ZIP archive export.
        </p>
        <div className="mt-2">
          <NextSaaSBtn text="Select Batch Documents" variant="primary" size="md" />
        </div>
      </div>

      {/* Queue Manager & Staged File List */}
      {files.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col gap-6">
          {/* Header & Capacity Meter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg text-[var(--ink)]">
                  Staged Batch Queue ({files.length} / 100 Files)
                </h3>
                <Badge variant="pro">2GB CAPACITOR</Badge>
              </div>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Total batch payload: <span className="font-bold text-[var(--ink)]">{totalMb} MB</span> / 2,048 MB
              </p>
            </div>

            <button
              onClick={() => {
                setFiles([]);
                setIsCompleted(false);
              }}
              className="text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors"
            >
              Clear Entire Queue
            </button>
          </div>

          {/* Progress bar during execution */}
          {isProcessing && (
            <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold text-[var(--ink)]">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--primary-500)]" />
                  Processing parallel worker threads in MinIO sandbox...
                </span>
                <span className="font-mono">{overallProgress}%</span>
              </div>
              <div className="w-full h-2 bg-[var(--line)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--primary-500)] transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* File Queue Items */}
          <div className="max-h-72 overflow-y-auto divide-y divide-[var(--line)] pr-2">
            {files.map((file) => (
              <div key={file.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[var(--soft)] flex items-center justify-center text-[var(--primary-500)] shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-[var(--ink)] truncate max-w-sm">{file.name}</span>
                  <span className="text-[var(--muted)] shrink-0">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {file.status === 'done' && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  )}
                  {file.status === 'processing' && (
                    <span className="text-[var(--primary-500)] font-bold flex items-center gap-1 text-[11px]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> {file.progress}%
                    </span>
                  )}
                  {!isProcessing && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[var(--muted)]">
              {isCompleted
                ? 'All documents processed and bundled into structured ZIP archive.'
                : 'Priority Queue routing: files processed simultaneously across warm worker containers.'}
            </span>

            {!isCompleted ? (
              <button
                onClick={runBatchProcessing}
                disabled={isProcessing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[var(--primary-500)] text-white font-bold text-xs hover:bg-[var(--primary-700)] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Processing {files.length} Files...</span>
                  </>
                ) : (
                  <span>Execute Parallel Batch ({files.length} Files) →</span>
                )}
              </button>
            ) : (
              <div className="w-full sm:w-auto flex items-center gap-3">
                <button
                  onClick={() => alert(`Downloading consolidated archive: SimplifyPDF_Batch_${Date.now()}.zip`)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[var(--secondary)] text-white font-bold text-xs hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>Download Consolidated ZIP ({totalMb} MB)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
