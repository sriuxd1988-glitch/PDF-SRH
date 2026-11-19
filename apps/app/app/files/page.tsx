'use client';

import React, { useState } from 'react';
import {
  Clock,
  Download,
  Trash2,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  FolderArchive,
  ArrowDownToLine,
  ShieldCheck,
} from 'lucide-react';
import { Badge, NextSaaSBtn } from '@simplifypdf/ui';
import { useApp } from '../../components/DashboardShell';

interface HistoryItem {
  id: string;
  name: string;
  tool: string;
  origSize: string;
  newSize: string;
  reduction: string;
  expiresIn: string;
  createdAt: string;
}

export default function HistoryVaultPage() {
  const { userRole, openUpgradeModal } = useApp();
  const [search, setSearch] = useState('');
  const [files, setFiles] = useState<HistoryItem[]>([
    {
      id: 'h-1',
      name: 'Board_Meeting_Minutes_Nov2025.pdf',
      tool: 'Compress (Extreme)',
      origSize: '18.4 MB',
      newSize: '4.2 MB',
      reduction: '-77%',
      expiresIn: userRole === 'PRO' ? '22:15:40' : '01:25:10',
      createdAt: '35 mins ago',
    },
    {
      id: 'h-2',
      name: 'Vendor_Agreement_Signed_Cryptographic.pdf',
      tool: 'e-Sign + Audit Sheet',
      origSize: '2.8 MB',
      newSize: '3.1 MB',
      reduction: 'Certified',
      expiresIn: userRole === 'PRO' ? '21:04:15' : '00:55:00',
      createdAt: '1 hour ago',
    },
    {
      id: 'h-3',
      name: 'Financial_Ledger_Q3_Redacted.pdf',
      tool: 'Permanent Redaction',
      origSize: '9.6 MB',
      newSize: '7.8 MB',
      reduction: '-19%',
      expiresIn: userRole === 'PRO' ? '20:10:00' : '00:30:15',
      createdAt: '1.5 hours ago',
    },
    {
      id: 'h-4',
      name: 'Scanned_Invoice_Archive_OCR.pdf',
      tool: 'OCR Searchable PDF/A',
      origSize: '14.2 MB',
      newSize: '11.5 MB',
      reduction: 'PDF/A-1b',
      expiresIn: userRole === 'PRO' ? '18:40:00' : 'Expired',
      createdAt: '3 hours ago',
    },
  ]);

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) || f.tool.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Immediately shred and purge "${name}" from MinIO S3?`)) {
      setFiles((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleWipeAll = () => {
    if (confirm('Permanently wipe and purge all stored files from the encrypted S3 storage?')) {
      setFiles([]);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[var(--ink)] tracking-tight">
              Document History Vault
            </h1>
            <Badge variant="neutral">{files.length} Files Retained</Badge>
          </div>
          <p className="text-sm text-[var(--muted)] font-normal mt-1.5 max-w-2xl leading-relaxed">
            {userRole === 'PRO'
              ? 'Files persist in your encrypted S3 vault for 24 hours. You can download or trigger instant GDPR-compliant shredding at any time.'
              : 'Free member files are automatically shredded 2 hours after creation. Upgrade to Pro for 24-hour vault retention.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {files.length > 0 && (
            <button
              onClick={handleWipeAll}
              className="px-4 py-2.5 rounded-2xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors inline-flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge All Files Now</span>
            </button>
          )}
          {userRole === 'FREE' && (
            <button
              onClick={() => openUpgradeModal('Upgrade to 24h retention')}
              className="px-4 py-2.5 rounded-2xl bg-[var(--primary-500)] text-white font-bold text-xs hover:bg-[var(--primary-700)] transition-colors"
            >
              Extend Retention to 24h
            </button>
          )}
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents or tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--ink)] outline-none focus:border-[var(--primary-500)] shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted with MinIO S3 Server-Side Encryption</span>
        </div>
      </div>

      {/* Files Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        {filtered.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--soft)] text-[var(--muted)] flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-[var(--ink)] tracking-tight">
              No files currently in vault
            </h3>
            <p className="text-xs text-[var(--muted)] max-w-sm">
              Files you process in the workspace or batch studio will appear here until their auto-shred countdown elapses.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--muted)] uppercase tracking-wider font-bold">
                  <th className="pb-3.5 pl-2">Document Name</th>
                  <th className="pb-3.5">Operation</th>
                  <th className="pb-3.5">Original</th>
                  <th className="pb-3.5">Processed</th>
                  <th className="pb-3.5">Efficiency</th>
                  <th className="pb-3.5">Auto-Shred In</th>
                  <th className="pb-3.5 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] font-medium">
                {filtered.map((file) => (
                  <tr key={file.id} className="hover:bg-[var(--soft)]/50 transition-colors">
                    <td className="py-4 pl-2 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--primary-50)] text-[var(--primary-500)] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[var(--ink)] block truncate max-w-xs">{file.name}</span>
                        <span className="text-[11px] text-[var(--muted)]">{file.createdAt}</span>
                      </div>
                    </td>
                    <td className="py-4 text-[var(--muted)]">{file.tool}</td>
                    <td className="py-4 text-[var(--muted)]">{file.origSize}</td>
                    <td className="py-4 font-bold text-[var(--ink)]">{file.newSize}</td>
                    <td className="py-4">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        {file.reduction}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="font-mono text-xs font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {file.expiresIn}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => alert(`Streaming signed S3 download for ${file.name}`)}
                          className="px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:bg-[var(--line)] text-[var(--ink)] font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => handleDelete(file.id, file.name)}
                          className="p-1.5 rounded-xl border border-[var(--line)] hover:bg-rose-50 text-rose-500 transition-colors"
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
