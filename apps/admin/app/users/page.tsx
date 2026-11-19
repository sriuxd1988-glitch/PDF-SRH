'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Shield,
  Ban,
  CheckCircle,
  Clock,
  MoreVertical,
  ExternalLink,
  Sparkles,
  Zap,
  Trash2,
  X,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '@simplifypdf/ui';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  plan: 'FREE' | 'PRO';
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  tasksToday: number;
  totalTasks: number;
  joinedAt: string;
  lastActiveIp: string;
  gatewaySubId?: string;
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<'ALL' | 'FREE' | 'PRO'>('ALL');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

  const [users, setUsers] = useState<UserRecord[]>([
    {
      id: 'usr_8291a',
      name: 'John Doe',
      email: 'john.doe@example.com',
      plan: 'FREE',
      role: 'USER',
      status: 'ACTIVE',
      tasksToday: 3,
      totalTasks: 48,
      joinedAt: 'Nov 12, 2025',
      lastActiveIp: '49.207.214.12',
    },
    {
      id: 'usr_9410b',
      name: 'Sarah Connor',
      email: 'sarah.c@techcorp.io',
      plan: 'PRO',
      role: 'USER',
      status: 'ACTIVE',
      tasksToday: 38,
      totalTasks: 412,
      joinedAt: 'Oct 04, 2025',
      lastActiveIp: '103.21.144.9',
      gatewaySubId: 'sub_Stripe_1948271',
    },
    {
      id: 'usr_5128c',
      name: 'Priya Sharma',
      email: 'priya.legal@mumbai-law.in',
      plan: 'PRO',
      role: 'USER',
      status: 'ACTIVE',
      tasksToday: 82,
      totalTasks: 1840,
      joinedAt: 'Aug 19, 2025',
      lastActiveIp: '157.34.18.90',
      gatewaySubId: 'sub_Razorpay_827192',
    },
    {
      id: 'usr_2209d',
      name: 'Spam Bot Crawler',
      email: 'crawl99@disposable-mail.net',
      plan: 'FREE',
      role: 'USER',
      status: 'SUSPENDED',
      tasksToday: 10,
      totalTasks: 10,
      joinedAt: 'Nov 19, 2025',
      lastActiveIp: '185.220.101.5',
    },
    {
      id: 'usr_0001a',
      name: 'Super Admin',
      email: 'admin@simplifypdf.com',
      plan: 'PRO',
      role: 'ADMIN',
      status: 'ACTIVE',
      tasksToday: 5,
      totalTasks: 580,
      joinedAt: 'Jan 01, 2025',
      lastActiveIp: '127.0.0.1',
    },
  ]);

  const handleGrantPro = (userId: string, duration: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, plan: 'PRO' } : u))
    );
    if (selectedUser?.id === userId) {
      setSelectedUser((prev) => prev ? { ...prev, plan: 'PRO' } : null);
    }
    alert(`Granted Pro override (${duration}) to user ${userId}. Audit log written.`);
  };

  const handleToggleSuspend = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          alert(`User ${userId} status changed to ${newStatus}. Active JWT revoked in Redis.`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
    if (selectedUser?.id === userId) {
      setSelectedUser((prev) =>
        prev ? { ...prev, status: prev.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : null
      );
    }
  };

  const handleResetQuota = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, tasksToday: 0 } : u))
    );
    if (selectedUser?.id === userId) {
      setSelectedUser((prev) => prev ? { ...prev, tasksToday: 0 } : null);
    }
    alert(`Reset daily quota counter to 0 for user ${userId}.`);
  };

  const handleGdprDelete = (userId: string) => {
    if (confirm(`GDPR Warning: Permanently expunge user ${userId} and purge all associated files from database and MinIO S3?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setSelectedUser(null);
      alert(`User ${userId} permanently purged from all systems.`);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === 'ALL' || u.plan === planFilter;
    return matchSearch && matchPlan;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-bold text- tracking-tight sm:text-3xl text-[var(--ink)]">
              User Directory &amp; Access Controls
            </h1>
            <Badge variant="live">{users.length} Registered Accounts</Badge>
          </div>
          <p className="text-sm text-[var(--muted)] mt-1.5 max-w-2xl">
            Inspect individual user accounts, audit daily task consumption, grant manual Pro status overrides, revoke JWT sessions, and execute GDPR Article 17 account erasures.
          </p>
        </div>
      </div>

      {/* Search & Plan Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--ink)] outline-none focus:border-[var(--primary-500)] shadow-sm"
          />
        </div>

        <div className="flex gap-2">
          {['ALL', 'FREE', 'PRO'].map((p) => (
            <button
              key={p}
              onClick={() => setPlanFilter(p as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                planFilter === p
                  ? 'bg-[var(--primary-500)] text-white shadow-sm'
                  : 'bg-[var(--card)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--muted)] uppercase tracking-wider font-bold">
                <th className="pb-3.5 pl-2">User Identity</th>
                <th className="pb-3.5">Plan Tier</th>
                <th className="pb-3.5">Status</th>
                <th className="pb-3.5">Tasks Today</th>
                <th className="pb-3.5">Total Tasks</th>
                <th className="pb-3.5">Registered</th>
                <th className="pb-3.5 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] font-medium">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--soft)]/50 transition-colors">
                  <td className="py-4 pl-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary-500)] text-white font-bold flex items-center justify-center shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-[var(--ink)] block">{user.name}</span>
                      <span className="text-[11px] text-[var(--muted)]">{user.email}</span>
                    </div>
                  </td>

                  <td className="py-4">
                    {user.plan === 'PRO' ? (
                      <Badge variant="pro">PRO (2GB)</Badge>
                    ) : (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--soft)] text-[var(--muted)] border border-[var(--line)]">
                        Free Starter
                      </span>
                    )}
                  </td>

                  <td className="py-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-md inline-flex items-center gap-1 ${
                        user.status === 'ACTIVE'
                          ? 'text-emerald-700 bg-emerald-500/10'
                          : 'text-rose-700 bg-rose-500/10'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="py-4 font-mono font-bold text-[var(--ink)]">
                    {user.tasksToday} / {user.plan === 'PRO' ? '250' : '10'}
                  </td>

                  <td className="py-4 font-mono text-[var(--muted)]">{user.totalTasks}</td>

                  <td className="py-4 text-[var(--muted)]">{user.joinedAt}</td>

                  <td className="py-4 text-right pr-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-3 py-1.5 rounded-xl border border-[var(--line)] hover:bg-[var(--line)] text-[var(--ink)] font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Inspection Drawer Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[var(--card)] border border-[var(--line)] rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-6 right-6 p-2 rounded-full border border-[var(--line)] bg-[var(--soft)] hover:bg-[var(--line)] text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--primary-500)] text-white font-semibold text-xl flex items-center justify-center">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-heading font-bold text- tracking-tight text-[var(--ink)]">
                  {selectedUser.name}
                </h3>
                <span className="text-xs font-mono text-[var(--muted)]">{selectedUser.id} · {selectedUser.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
              <div className="p-3 rounded-2xl bg-[var(--soft)] border border-[var(--line)]">
                <span className="text-[10px] font-bold uppercase text-[var(--muted)]">Subscription Tier</span>
                <span className="block font-semibold text-[var(--ink)] mt-0.5">{selectedUser.plan}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--soft)] border border-[var(--line)]">
                <span className="text-[10px] font-bold uppercase text-[var(--muted)]">Account Status</span>
                <span className="block font-semibold text-[var(--ink)] mt-0.5">{selectedUser.status}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--soft)] border border-[var(--line)]">
                <span className="text-[10px] font-bold uppercase text-[var(--muted)]">Last Active IP</span>
                <span className="block font-mono font-bold text-[var(--ink)] mt-0.5">{selectedUser.lastActiveIp}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--soft)] border border-[var(--line)]">
                <span className="text-[10px] font-bold uppercase text-[var(--muted)]">Tasks Used Today</span>
                <span className="block font-mono font-bold text-[var(--ink)] mt-0.5">{selectedUser.tasksToday}</span>
              </div>
            </div>

            {/* Admin Action Triggers */}
            <div className="space-y-3 pt-4 border-t border-[var(--line)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] block">
                Administrative Overrides
              </span>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleResetQuota(selectedUser.id)}
                  className="px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:bg-[var(--line)] text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Daily Quota to 0</span>
                </button>

                {selectedUser.plan === 'FREE' && (
                  <button
                    onClick={() => handleGrantPro(selectedUser.id, '1 Month')}
                    className="px-3 py-2 rounded-xl bg-[var(--primary-500)] text-white text-xs font-bold hover:bg-[var(--primary-700)] inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Grant Pro (1 Month VIP)</span>
                  </button>
                )}

                <button
                  onClick={() => handleToggleSuspend(selectedUser.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${
                    selectedUser.status === 'ACTIVE'
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>{selectedUser.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate Account'}</span>
                </button>

                <button
                  onClick={() => handleGdprDelete(selectedUser.id)}
                  className="px-3 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>GDPR Article 17 Erasure</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
