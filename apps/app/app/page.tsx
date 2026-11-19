'use client';

import React, { useState } from 'react';
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
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ButtonV6, NextSaaSBtn, Badge, GlowCard } from '@simplifypdf/ui';
import Link from 'next/link';

export default function UserWorkspacePage() {
  const [userRole, setUserRole] = useState<'FREE' | 'PRO'>('FREE');
  const [recentFiles, setRecentFiles] = useState([
    { id: '1', name: 'Annual_Tax_Return_2025.pdf', size: '3.4 MB', tool: 'Compress', status: 'Completed', time: '14 mins ago' },
    { id: '2', name: 'Contract_Vendor_Signed.pdf', size: '1.2 MB', tool: 'Protect', status: 'Completed', time: '1 hour ago' },
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="border-b border-[var(--line)] bg-[var(--card)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-500)] text-white font-black text-lg flex items-center justify-center">
              S
            </div>
            <span className="font-heading font-black text-lg text-[var(--ink)]">SimplifyPDF</span>
          </Link>
          <span className="text-xs text-[var(--muted)]">/</span>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">Workspace</span>
        </div>

        {/* Role Toggle Switch for Testing Free vs Pro */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--soft)] border border-[var(--line)] text-xs font-bold">
            <button
              onClick={() => setUserRole('FREE')}
              className={`px-3 py-1 rounded-full transition-all ${
                userRole === 'FREE' ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
              }`}
            >
              Free Member
            </button>
            <button
              onClick={() => setUserRole('PRO')}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                userRole === 'PRO' ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
              }`}
            >
              <span>PRO Member</span>
              <span className="w-2 h-2 rounded-full bg-[var(--lime)] inline-block" />
            </button>
          </div>

          <div className="w-8 h-8 rounded-full bg-[var(--primary-500)] text-white text-xs font-bold flex items-center justify-center">
            JD
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Workspace Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-heading font-black text-2xl text-[var(--ink)]">
                Welcome back, John!
              </h1>
              {userRole === 'PRO' ? (
                <Badge variant="pro">PRO PLAN (2GB)</Badge>
              ) : (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[var(--soft)] text-[var(--muted)]">
                  Free Starter (50MB)
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--muted)] mt-1">
              {userRole === 'PRO'
                ? 'High-speed batch processing enabled with 24-hour file retention.'
                : '10 daily tasks with 2-hour auto-shredding. Upgrade anytime for 2GB limits.'}
            </p>
          </div>

          {userRole === 'FREE' && (
            <Link href="/pricing">
              <ButtonV6 text="Upgrade to PRO" hoverText="Unlock 2GB Batch" variant="primary" size="md" />
            </Link>
          )}

          {userRole === 'PRO' && (
            <Link href="/batch">
              <NextSaaSBtn text="Open Batch ZIP Studio" variant="primary" size="md" icon={<FolderArchive className="w-4 h-4 text-white" />} />
            </Link>
          )}
        </div>

        {/* Meters & Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Daily Quota Card */}
          <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-3">
                <span>Daily Tasks Usage</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-black text-3xl text-[var(--ink)]">
                  {userRole === 'PRO' ? '18' : '3'}
                </span>
                <span className="text-sm font-semibold text-[var(--muted)]">
                  / {userRole === 'PRO' ? '250' : '10'} tasks used
                </span>
              </div>
            </div>
            <div className="mt-6">
              <div className="w-full h-2.5 bg-[var(--soft)] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-[var(--primary-500)] rounded-full"
                  style={{ width: userRole === 'PRO' ? '7.2%' : '30%' }}
                />
              </div>
              <span className="text-[11px] text-[var(--muted)] font-semibold">Resets tomorrow at 00:00 UTC</span>
            </div>
          </div>

          {/* Retention & Privacy Card */}
          <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-3">
                <span>Retention Countdown</span>
                <Clock className="w-4 h-4 text-[var(--primary-500)]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-black text-3xl font-mono text-[var(--ink)]">
                  {userRole === 'PRO' ? '23:45:10' : '01:42:15'}
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] mt-1">
                {userRole === 'PRO' ? '24h retention period with instant shred option' : 'Files automatically shredded 2 hours after creation'}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  setRecentFiles([]);
                  alert('All files shredded and securely wiped from S3.');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Wipe all files now
              </button>
            </div>
          </div>

          {/* Max Capacity Card */}
          <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-3">
                <span>File Size Capacity</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-black text-3xl text-[var(--ink)]">
                  {userRole === 'PRO' ? '2048 MB' : '50 MB'}
                </span>
                <span className="text-sm font-semibold text-[var(--muted)]">per file</span>
              </div>
              <p className="text-xs text-[var(--muted)] mt-1">
                {userRole === 'PRO' ? 'Full batch ZIP multi-file parallel processing' : 'Single file upload queue'}
              </p>
            </div>
            <div className="mt-4">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Direct MinIO S3 Presigned
              </span>
            </div>
          </div>
        </div>

        {/* Recent Processed Files */}
        <div className="rounded-3xl bg-[var(--card)] border border-[var(--line)] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-black text-xl text-[var(--ink)]">
              Recent Processed Documents
            </h2>
            <span className="text-xs font-bold text-[var(--muted)]">
              {recentFiles.length} files available
            </span>
          </div>

          {recentFiles.length === 0 ? (
            <div className="text-center py-12 text-[var(--muted)] text-sm">
              No files currently stored. Process a new document below.
            </div>
          ) : (
            <div className="divide-y divide-[var(--line)]">
              {recentFiles.map((file) => (
                <div key={file.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary-50)] text-[var(--primary-500)] flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--ink)]">{file.name}</div>
                      <div className="text-xs text-[var(--muted)] flex items-center gap-2 mt-0.5">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>{file.tool}</span>
                        <span>•</span>
                        <span>{file.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => alert(`Downloading ${file.name}`)}
                      className="p-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:bg-[var(--line)] text-[var(--ink)] transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setRecentFiles(recentFiles.filter((f) => f.id !== file.id))}
                      className="p-2 rounded-xl border border-[var(--line)] hover:bg-rose-50 text-rose-500 transition-colors"
                      title="Delete now"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
