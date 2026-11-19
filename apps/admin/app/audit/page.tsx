'use client';

import React, { useState } from 'react';
import {
  History,
  Download,
  Search,
  Filter,
  ShieldCheck,
  FileText,
  User,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@simplifypdf/ui';

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  resource: string;
  action: string;
  ipAddress: string;
  diff: string;
}

export default function AdminAuditPage() {
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState<AuditEntry[]>([
    {
      id: 'aud_82910',
      timestamp: 'Today, 14:10:04 UTC',
      actor: 'admin@simplifypdf.com',
      resource: 'Plan:free',
      action: 'UPDATE_LIMITS',
      ipAddress: '127.0.0.1',
      diff: JSON.stringify({ maxFileSizeMb: { old: 50, new: 50 }, dailyTasksLimit: { old: 10, new: 10 } }),
    },
    {
      id: 'aud_82909',
      timestamp: 'Today, 12:45:22 UTC',
      actor: 'admin@simplifypdf.com',
      resource: 'Tool:word-to-pdf',
      action: 'MAINTENANCE_TOGGLE',
      ipAddress: '127.0.0.1',
      diff: JSON.stringify({ isMaintenance: { old: false, new: false } }),
    },
    {
      id: 'aud_82908',
      timestamp: 'Yesterday, 19:12:11 UTC',
      actor: 'admin@simplifypdf.com',
      resource: 'User:usr_9410b',
      action: 'GRANT_PRO_OVERRIDE',
      ipAddress: '49.207.214.12',
      diff: JSON.stringify({ plan: { old: 'FREE', new: 'PRO' }, duration: '1 Month' }),
    },
    {
      id: 'aud_82907',
      timestamp: 'Nov 18, 2025, 10:04:19 UTC',
      actor: 'admin@simplifypdf.com',
      resource: 'Transaction:tx_strp_8819',
      action: 'REFUND_ISSUED',
      ipAddress: '49.207.214.12',
      diff: JSON.stringify({ amount: '$4.99', reason: 'Customer dissatisfaction' }),
    },
    {
      id: 'aud_82906',
      timestamp: 'Nov 17, 2025, 16:20:00 UTC',
      actor: 'admin@simplifypdf.com',
      resource: 'DesignTokens',
      action: 'PUBLISH_TOKENS',
      ipAddress: '127.0.0.1',
      diff: JSON.stringify({ primaryColor: '#864FFE', accentLime: '#C6F56F', borderRadius: '16px' }),
    },
  ]);

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Timestamp,Actor,Resource,Action,IP,Diff']
        .concat(
          entries.map(
            (e) => `"${e.id}","${e.timestamp}","${e.actor}","${e.resource}","${e.action}","${e.ipAddress}","${e.diff.replace(/"/g, '""')}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `simplifypdf_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = entries.filter((e) =>
    e.actor.toLowerCase().includes(search.toLowerCase()) ||
    e.resource.toLowerCase().includes(search.toLowerCase()) ||
    e.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-[var(--ink)]">
              Administrative Audit Trail
            </h1>
            <Badge variant="live" dot>IMMUTABLE POSTGRES LOG</Badge>
          </div>
          <p className="text-sm text-[var(--muted)] mt-1.5 max-w-2xl">
            Append-only compliance log recording all tool kill-switch toggles, plan quota edits, user impersonations, manual Pro overrides, and refund actions with JSON diff payloads.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-5 py-2.5 rounded-2xl bg-[var(--secondary)] text-white font-bold text-xs hover:bg-black transition-all inline-flex items-center gap-2 shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-white" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by actor, action, or resource..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--ink)] outline-none focus:border-[var(--primary-500)] shadow-sm"
        />
      </div>

      {/* Audit Log Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--muted)] uppercase tracking-wider font-bold">
                <th className="pb-3.5 pl-2">Timestamp (UTC)</th>
                <th className="pb-3.5">Admin Actor</th>
                <th className="pb-3.5">Action &amp; Target</th>
                <th className="pb-3.5">Origin IP</th>
                <th className="pb-3.5 pr-2">Changes Payload (Diff)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] font-medium">
              {filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-[var(--soft)]/50 transition-colors">
                  <td className="py-4 pl-2 font-mono text-[var(--muted)] whitespace-nowrap">
                    {entry.timestamp}
                  </td>

                  <td className="py-4">
                    <span className="font-bold text-[var(--ink)] block">{entry.actor}</span>
                    <span className="text-[10px] font-mono text-[var(--muted)]">{entry.id}</span>
                  </td>

                  <td className="py-4">
                    <span className="font-mono text-xs font-bold text-[var(--primary-500)] bg-[var(--primary-50)] dark:bg-violet-950/20 px-2 py-0.5 rounded-md inline-block">
                      {entry.action}
                    </span>
                    <span className="block text-[11px] font-mono text-[var(--muted)] mt-1">
                      {entry.resource}
                    </span>
                  </td>

                  <td className="py-4 font-mono text-[var(--muted)]">{entry.ipAddress}</td>

                  <td className="py-4 pr-2">
                    <code className="p-2 rounded-lg bg-[var(--soft)] border border-[var(--line)] font-mono text-[11px] text-[var(--ink)] block overflow-x-auto max-w-md whitespace-pre-wrap">
                      {entry.diff}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
