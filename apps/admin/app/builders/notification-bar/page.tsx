'use client';

import React, { useState } from 'react';
import {
  Megaphone,
  Clock,
  Sparkles,
  CheckCircle2,
  Power,
  Link as LinkIcon,
  Calendar,
} from 'lucide-react';
import { BuilderEngine } from '../../../components/builder/BuilderEngine';

export default function NotificationBarBuilderPage() {
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState('⚡ Flash Launch Offer: Upgrade to SimplifyPDF Pro for ₹249/mo & get 2GB batch multi-file processing!');
  const [ctaText, setCtaText] = useState('Claim Offer →');
  const [ctaUrl, setCtaUrl] = useState('/pricing');
  const [bgColor, setBgColor] = useState('#864FFE');
  const [isDismissible, setIsDismissible] = useState(true);
  const [startDate, setStartDate] = useState('2025-11-20');
  const [endDate, setEndDate] = useState('2025-12-31');

  const handlePublish = () => {
    console.log('Publishing notification bar config to database and cache:config:notification-bar');
  };

  return (
    <BuilderEngine
      title="Notification Bar Builder"
      subtitle="Visual designer for site-wide announcements, scheduled campaigns, and discount banners."
      onPublish={handlePublish}
    >
      <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col gap-6">
        {/* Master Status Switch */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)]">
          <div>
            <h4 className="text-xs font-bold text-[var(--ink)]">Announcement Bar Master Switch</h4>
            <p className="text-[11px] text-[var(--muted)]">Toggle visibility immediately across all public routes.</p>
          </div>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
              isActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
            }`}
          >
            <Power className="w-3.5 h-3.5 text-white" />
            <span>{isActive ? 'ACTIVE (DISPLAYING)' : 'INACTIVE (HIDDEN)'}</span>
          </button>
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
            Announcement Message (Emoji &amp; Markdown Supported)
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)]"
          />
        </div>

        {/* CTA Link */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
              CTA Button Label
            </label>
            <input
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold text-[var(--ink)]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
              Destination URL
            </label>
            <input
              type="text"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-mono text-[var(--muted)]"
            />
          </div>
        </div>

        {/* Color Presets */}
        <div>
          <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-2">
            Banner Background Styling
          </label>
          <div className="flex items-center gap-3">
            {[
              { label: 'Nuvexa Violet', hex: '#864FFE' },
              { label: 'Near Black', hex: '#1A1A1C' },
              { label: 'Emerald Trust', hex: '#059669' },
              { label: 'Amber Alert', hex: '#D97706' },
            ].map((preset) => (
              <button
                key={preset.hex}
                onClick={() => setBgColor(preset.hex)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  bgColor === preset.hex
                    ? 'border-[var(--ink)] ring-2 ring-[var(--primary-500)]/30'
                    : 'border-[var(--line)] bg-[var(--soft)] text-[var(--muted)]'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.hex }} />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Schedule & Dismissible */}
        <div className="pt-4 border-t border-[var(--line)] space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                Campaign Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[var(--muted)] uppercase mb-1">
                Campaign End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)]"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={isDismissible}
              onChange={(e) => setIsDismissible(e.target.checked)}
              className="accent-[var(--primary-500)]"
            />
            <span>Allow users to dismiss banner (stores 7-day cookie)</span>
          </label>
        </div>
      </div>
    </BuilderEngine>
  );
}
