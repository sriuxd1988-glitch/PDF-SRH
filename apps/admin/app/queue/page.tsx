'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  RotateCcw,
  Trash2,
  AlertOctagon,
  CheckCircle2,
  Server,
  Zap,
  Activity,
  HardDrive,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '@simplifypdf/ui';

interface DLQJob {
  id: string;
  tool: string;
  fileName: string;
  userTier: string;
  errorMessage: string;
  stackTrace: string;
  timestamp: string;
  attempts: number;
}

export default function AdminQueuePage() {
  const [dlqJobs, setDlqJobs] = useState<DLQJob[]>([
    {
      id: 'job_dlq_99182',
      tool: 'Word to PDF',
      fileName: 'Corrupted_Macro_Doc.docx',
      userTier: 'FREE',
      errorMessage: 'LibreOffice process timed out after 60 seconds hard kill.',
      stackTrace: 'TimeoutError: soffice --headless process exceeded 60000ms.\n  at WorkerEngine.executeSubprocess (/apps/workers/tools/office.py:84)',
      timestamp: 'Today, 11:15 UTC',
      attempts: 3,
    },
    {
      id: 'job_dlq_88201',
      tool: 'OCR Searchable PDF/A',
      fileName: 'Unreadable_Thermal_Receipt.pdf',
      userTier: 'PRO',
      errorMessage: 'Tesseract OCR syntax exception on corrupted DPI header.',
      stackTrace: 'CorruptDPIException: Page 1 image metadata contains zero resolution.\n  at ocrmypdf.exec (/apps/workers/tools/ocr.py:52)',
      timestamp: 'Today, 08:32 UTC',
      attempts: 3,
    },
  ]);

  const handleRetry = (jobId: string) => {
    alert(`Re-enqueued ${jobId} directly to Priority Redis Stream stream:pdf-jobs:pro with elevated priority.`);
    setDlqJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const handleDelete = (jobId: string) => {
    if (confirm(`Purge failed job ${jobId} and delete associated scratch file from MinIO S3?`)) {
      setDlqJobs((prev) => prev.filter((j) => j.id !== jobId));
      alert(`Job ${jobId} and scratch storage permanently removed.`);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-bold text- tracking-tight sm:text-3xl text-[var(--ink)]">
              Redis Queue &amp; Worker Health Console
            </h1>
            <Badge variant="live" dot>REDIS 7.2 ONLINE</Badge>
          </div>
          <p className="text-sm text-[var(--muted)] mt-1.5 max-w-2xl">
            Real-time telemetry across standard and priority Redis streams, LibreOffice concurrency lock semaphore (Limit: 1), container RAM/CPU usage, and dead-letter queue (DLQ) retry management.
          </p>
        </div>
      </div>

      {/* Queue Streams Depth Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] mb-2">
            <span>Priority Stream Depth</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-heading font-bold text- tracking-tight text-[var(--ink)]">0 Lag</div>
          <span className="text-[11px] font-mono text-[var(--muted)] block mt-1">stream:pdf-jobs:pro</span>
          <span className="text-xs text-emerald-600 font-bold mt-2 block">⚡ Dedicated Warm Pool</span>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] mb-2">
            <span>Standard Stream Depth</span>
            <Layers className="w-4 h-4 text-[var(--primary-500)]" />
          </div>
          <div className="font-heading font-bold text- tracking-tight text-[var(--ink)]">2 Queued</div>
          <span className="text-[11px] font-mono text-[var(--muted)] block mt-1">stream:pdf-jobs (Free)</span>
          <span className="text-xs text-[var(--muted)] font-bold mt-2 block">Avg Wait: 0.4s</span>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] mb-2">
            <span>LibreOffice Semaphore</span>
            <Server className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-heading font-bold text- tracking-tight text-[var(--ink)]">1 / 1 Lock</div>
          <span className="text-[11px] font-mono text-[var(--muted)] block mt-1">lock:libreoffice:semaphore</span>
          <span className="text-xs text-amber-600 font-bold mt-2 block">Max 1 VPS Guard Active</span>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] mb-2">
            <span>Dead-Letter Queue (DLQ)</span>
            <AlertOctagon className="w-4 h-4 text-rose-500" />
          </div>
          <div className="font-heading font-bold text- tracking-tight text-rose-600">{dlqJobs.length} Failed</div>
          <span className="text-[11px] font-mono text-[var(--muted)] block mt-1">stream:pdf-jobs:dlq</span>
          <span className="text-xs text-rose-600 font-bold mt-2 block">Action Required</span>
        </div>
      </div>

      {/* Worker Resource Consumption */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col gap-6">
        <h3 className="font-heading font-semibold text- tracking-tight text-[var(--ink)]">
          Container Resource Allocation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[var(--ink)]">VPS Host CPU (2 vCPU)</span>
              <span className="font-mono text-emerald-600">32%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--line)] overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '32%' }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[var(--ink)]">RAM Allocation (4 GB Host)</span>
              <span className="font-mono text-emerald-600">58% (2.3 GB)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--line)] overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '58%' }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[var(--ink)]">MinIO Disk Storage (NVMe)</span>
              <span className="font-mono text-emerald-600">12% (12 GB / 100 GB)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--line)] overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Dead-Letter Queue (DLQ) Inspector */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-semibold text- tracking-tight text-[var(--ink)]">
              Dead-Letter Queue (DLQ) Inspector
            </h3>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Inspect jobs that exhausted maximum retries. Inspect raw error stack traces, purge from S3, or re-enqueue to priority queue.
            </p>
          </div>
        </div>

        {dlqJobs.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center gap-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            <h4 className="font-heading font-semibold text- tracking-tight text-[var(--ink)]">
              DLQ is Completely Empty!
            </h4>
            <p className="text-xs text-[var(--muted)]">All processed worker tasks completed cleanly.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dlqJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl border border-rose-200 bg-rose-500/5 flex flex-col gap-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-rose-700">{job.id}</span>
                    <span className="text-xs font-bold text-[var(--ink)]">{job.tool}</span>
                    <span className="text-[11px] text-[var(--muted)]">({job.fileName})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                      Tier: {job.userTier}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRetry(job.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-white" />
                      <span>Retry in Priority Queue</span>
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="p-1.5 rounded-xl border border-rose-300 hover:bg-rose-100 text-rose-600"
                      title="Purge Job"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-bold text-rose-600">{job.errorMessage}</div>

                <pre className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] font-mono text-[11px] text-[var(--text)] overflow-x-auto whitespace-pre-wrap">
                  {job.stackTrace}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
