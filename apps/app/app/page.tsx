'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  Zap,
  Trash2,
  Download,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  FolderArchive,
  ArrowRight,
  Layers,
  FileCheck,
} from 'lucide-react';
import { ButtonV6, NextSaaSBtn, Badge, GlowCard } from '@simplifypdf/ui';
import { useApp } from '../components/DashboardShell';

export default function WorkspacePage() {
  const { userRole, openUpgradeModal } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [taskCount, setTaskCount] = useState(userRole === 'PRO' ? 18 : 3);
  const [recentFiles, setRecentFiles] = useState([
    {
      id: 'f-1',
      name: 'Q3_Financial_Report_2025.pdf',
      size: '4.8 MB',
      tool: 'Compress (-68%)',
      time: '18 mins ago',
      retentionRemaining: '01:42:00',
    },
    {
      id: 'f-2',
      name: 'Executive_NDA_Signed.pdf',
      size: '1.4 MB',
      tool: 'e-Sign + Audit',
      time: '45 mins ago',
      retentionRemaining: '01:15:00',
    },
    {
      id: 'f-3',
      name: 'Audit_Compliance_Draft.pdf',
      size: '12.2 MB',
      tool: 'AES-256 Protect',
      time: '1 hour ago',
      retentionRemaining: '01:00:00',
    },
  ]);

  const maxFileMb = userRole === 'PRO' ? 2048 : 50;
  const maxDailyTasks = userRole === 'PRO' ? 250 : 10;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const fileSizeMb = file.size / (1024 * 1024);

    if (userRole === 'FREE' && fileSizeMb > 50) {
      openUpgradeModal(`File size (${fileSizeMb.toFixed(1)} MB) exceeds Free tier limit of 50 MB.`);
      return;
    }

    if (taskCount >= maxDailyTasks) {
      openUpgradeModal('You have reached your daily quota of 10 tasks. Upgrade to Pro for 250 tasks/day.');
      return;
    }

    setTaskCount((prev) => prev + 1);
    setRecentFiles((prev) => [
      {
        id: `f-${Date.now()}`,
        name: file.name,
        size: `${fileSizeMb.toFixed(1)} MB`,
        tool: 'Quick Process',
        time: 'Just now',
        retentionRemaining: userRole === 'PRO' ? '23:59:59' : '01:59:59',
      },
      ...prev,
    ]);
  };

  const handleShredAll = () => {
    if (confirm('Are you sure you want to permanently shred all files from MinIO storage? This action is irreversible.')) {
      setRecentFiles([]);
      alert('All files permanently shredded and purged from S3 storage.');
    }
  };

  const handleDeleteFile = (id: string) => {
    setRecentFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[var(--ink)] tracking-tight">
              Welcome back, John!
            </h1>
            {userRole === 'PRO' ? (
              <Badge variant="pro">PRO (2GB CAPACITOR)</Badge>
            ) : (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[var(--soft)] text-[var(--muted)] border border-[var(--line)]">
                Free Starter (50MB)
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--muted)] font-normal mt-1.5 max-w-2xl leading-relaxed">
            {userRole === 'PRO'
              ? 'Your account is equipped with 2GB upload capacitor, 24-hour file vault, and dedicated priority worker queue routing.'
              : 'You have 10 daily tasks with 50MB file limit and 2-hour zero-retention auto-shredding. Upgrade anytime for batch ZIP mode.'}
          </p>
        </div>

        {userRole === 'FREE' ? (
          <div onClick={() => openUpgradeModal('Direct workspace banner CTA')}>
            <ButtonV6 text="Upgrade to PRO" hoverText="Unlock 2GB + Batch" variant="primary" size="md" />
          </div>
        ) : (
          <Link href="/batch">
            <NextSaaSBtn
              text="Open Batch ZIP Studio"
              variant="primary"
              size="md"
              icon={<FolderArchive className="w-4 h-4 text-white" />}
            />
          </Link>
        )}
      </div>

      {/* Metrics & Quota Rail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Quota Meter */}
        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
              <span>Daily Tasks Meter</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-bold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight tabular-nums">
                {taskCount}
              </span>
              <span className="text-sm font-normal text-[var(--muted)]">
                / {maxDailyTasks} tasks used
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] mt-2">
              {maxDailyTasks - taskCount} tasks remaining today. Resets at 00:00 UTC.
            </p>
          </div>

          <div className="mt-6">
            <div className="w-full h-2.5 bg-[var(--soft)] rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-[var(--primary-500)] rounded-full transition-all"
                style={{ width: `${Math.min((taskCount / maxDailyTasks) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] font-semibold text-[var(--muted)]">
              <span>Used: {Math.round((taskCount / maxDailyTasks) * 100)}%</span>
              {userRole === 'FREE' && taskCount >= 8 && (
                <button
                  onClick={() => openUpgradeModal('Approaching 10 tasks daily limit')}
                  className="text-[var(--primary-500)] hover:underline"
                >
                  Increase limit →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Max File Capacity */}
        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
              <span>File Size Capacitor</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-bold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight tabular-nums">
                {maxFileMb} MB
              </span>
              <span className="text-sm font-normal text-[var(--muted)]">per document</span>
            </div>
            <p className="text-xs text-[var(--muted)] font-normal mt-2">
              {userRole === 'PRO'
                ? 'High-capacity direct S3 presigned PUT with zero proxy buffering.'
                : 'Need to process files over 50MB? Pro unlocks 2,048 MB (2GB).'}
            </p>
          </div>

          <div className="mt-6">
            {userRole === 'FREE' ? (
              <button
                onClick={() => openUpgradeModal('Upgrade file size to 2GB')}
                className="text-xs font-semibold text-[var(--primary-500)] hover:underline inline-flex items-center gap-1"
              >
                <span>Upgrade to 2GB Limit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 2GB Multi-File Ready
              </span>
            )}
          </div>
        </div>

        {/* Retention Countdown & Privacy */}
        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
              <span>Auto-Shred Retention</span>
              <Clock className="w-4 h-4 text-[var(--primary-500)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-bold text-3xl sm:text-4xl font-mono text-[var(--ink)] tracking-tight tabular-nums">
                {userRole === 'PRO' ? '23:45:10' : '01:42:15'}
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] mt-2">
              {userRole === 'PRO'
                ? 'Files retained in encrypted vault for 24 hours.'
                : 'Zero-retention: files shredded after 2 hours.'}
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleShredAll}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Instant GDPR Shred All Now
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Dropzone */}
      <div className="p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col items-center text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.xlsx,.pptx"
          className="hidden"
          onChange={handleFileUpload}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files) {
              const file = e.dataTransfer.files[0];
              const sizeMb = file.size / (1024 * 1024);
              if (userRole === 'FREE' && sizeMb > 50) {
                openUpgradeModal(`File size (${sizeMb.toFixed(1)} MB) exceeds 50MB free limit.`);
                return;
              }
              setTaskCount((prev) => prev + 1);
              setRecentFiles((prev) => [
                {
                  id: `f-${Date.now()}`,
                  name: file.name,
                  size: `${sizeMb.toFixed(1)} MB`,
                  tool: 'Quick Process',
                  time: 'Just now',
                  retentionRemaining: userRole === 'PRO' ? '23:59:59' : '01:59:59',
                },
                ...prev,
              ]);
            }
          }}
          className={`w-full max-w-2xl p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center gap-3 ${
            dragActive
              ? 'border-[var(--primary-500)] bg-[var(--primary-50)]'
              : 'border-[var(--line)] hover:border-[var(--primary-500)] bg-[var(--soft)]'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-[var(--card)] text-[var(--primary-500)] border border-[var(--line)] flex items-center justify-center shadow-sm">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="font-heading font-semibold text-xl text-[var(--ink)] tracking-tight">
            Drop document to start processing
          </h3>
          <p className="text-xs text-[var(--muted)] font-normal max-w-sm">
            Supports PDF, Word, Excel, and PowerPoint. Max file size: <span className="font-semibold text-[var(--ink)]">{maxFileMb} MB</span>.
          </p>
          <div className="mt-2">
            <NextSaaSBtn text="Select File from Computer" variant="primary" size="md" />
          </div>
        </div>
      </div>

      {/* Recent Files Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-semibold text-xl text-[var(--ink)] tracking-tight">
              Recent Processed Documents
            </h2>
            <p className="text-xs text-[var(--muted)] font-normal mt-0.5">
              Encrypted files stored in MinIO S3 with automated lifecycle deletion.
            </p>
          </div>
          <Link
            href="/files"
            className="text-xs font-semibold text-[var(--primary-500)] hover:underline inline-flex items-center gap-1"
          >
            <span>View all in Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentFiles.length === 0 ? (
          <div className="text-center py-12 text-[var(--muted)] text-sm">
            No files currently stored. Process a document above to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--muted)] uppercase tracking-wider font-bold">
                  <th className="pb-3 pl-2">Document</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Size</th>
                  <th className="pb-3">Retention Left</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] font-medium">
                {recentFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-[var(--soft)]/50 transition-colors">
                    <td className="py-3.5 pl-2 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[var(--primary-50)] text-[var(--primary-500)] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-[var(--ink)] truncate max-w-xs">{file.name}</span>
                    </td>
                    <td className="py-3.5 text-[var(--muted)]">{file.tool}</td>
                    <td className="py-3.5 text-[var(--muted)]">{file.size}</td>
                    <td className="py-3.5">
                      <span className="font-mono text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {file.retentionRemaining}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => alert(`Downloading signed S3 link for ${file.name}`)}
                          className="p-1.5 rounded-lg border border-[var(--line)] hover:bg-[var(--line)] text-[var(--ink)]"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-1.5 rounded-lg border border-[var(--line)] hover:bg-rose-50 text-rose-500"
                          title="Instant Shred"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
