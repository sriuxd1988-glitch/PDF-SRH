'use client';

import React, { useState } from 'react';
import {
  User,
  Lock,
  Shield,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Fingerprint,
} from 'lucide-react';
import { Badge, ButtonV6 } from '@simplifypdf/ui';

export default function SettingsPage() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile preferences updated successfully.');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert('Please fill in both current and new passwords.');
      return;
    }
    alert('Security credentials updated.');
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== 'DELETE') {
      alert('Please type "DELETE" to confirm complete account erasure.');
      return;
    }

    if (confirm('GDPR Article 17 Warning: This will permanently wipe your profile, all uploaded documents, active sessions, and billing history from MinIO S3 and database with zero recovery possible. Proceed?')) {
      alert('Account and all associated records permanently purged under GDPR Right to Erasure.');
      window.location.href = '/';
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-[var(--ink)]">
          Account &amp; Privacy Settings
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1.5">
          Manage your personal identity, security credentials, multi-factor authentication, and GDPR data erasure rights.
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-[var(--primary-500)] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-black text-lg text-[var(--ink)]">Profile Information</h2>
            <p className="text-xs text-[var(--muted)]">Your public name and contact email for notifications and invoices.</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)] outline-none focus:border-[var(--primary-500)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)] outline-none focus:border-[var(--primary-500)]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-[var(--primary-500)] text-white font-bold text-xs hover:bg-[var(--primary-700)] transition-colors shadow-sm"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Password & Security Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-black text-lg text-[var(--ink)]">Change Password</h2>
            <p className="text-xs text-[var(--muted)]">Update your master account login credentials.</p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">Current Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)] outline-none focus:border-[var(--primary-500)] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--ink)] mb-1.5">New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)] outline-none focus:border-[var(--primary-500)] font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-[var(--secondary)] text-white font-bold text-xs hover:bg-black transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication (2FA) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-[var(--ink)]">Two-Factor Authentication (2FA)</h2>
              <p className="text-xs text-[var(--muted)]">Require a TOTP verification code from Google Authenticator or 1Password.</p>
            </div>
          </div>

          <button
            onClick={() => {
              setTwoFactorEnabled(!twoFactorEnabled);
              alert(twoFactorEnabled ? '2FA Disabled' : '2FA Enabled with TOTP authenticator app.');
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              twoFactorEnabled
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-[var(--soft)] text-[var(--muted)] border border-[var(--line)]'
            }`}
          >
            {twoFactorEnabled ? 'Enabled' : 'Enable 2FA'}
          </button>
        </div>
      </div>

      {/* GDPR Article 17 Right to Erasure */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-500/5 border border-rose-500/20 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-black text-lg text-rose-600">
              GDPR Article 17 Right to Erasure
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Permanently destroy your user account, all stored documents in MinIO S3, quotas, and session history with zero data residue.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--card)] border border-rose-200 text-xs text-[var(--muted)]">
          <p className="font-bold text-rose-600 mb-1">Warning: Irreversible Action</p>
          Once executed, all active subscription access, document history in the vault, and account credentials are permanently expunged from the database and storage.
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            placeholder="Type DELETE to confirm"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            className="px-4 py-2.5 rounded-2xl bg-[var(--card)] border border-rose-200 text-xs text-rose-600 outline-none focus:border-rose-500 font-mono"
          />
          <button
            onClick={handleDeleteAccount}
            disabled={deleteConfirmation !== 'DELETE'}
            className={`px-6 py-2.5 rounded-2xl font-bold text-xs transition-all ${
              deleteConfirmation === 'DELETE'
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm cursor-pointer'
                : 'bg-rose-200 text-rose-400 cursor-not-allowed'
            }`}
          >
            Permanently Erase My Account &amp; All Data
          </button>
        </div>
      </div>
    </div>
  );
}
