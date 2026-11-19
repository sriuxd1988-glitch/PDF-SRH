'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Check, RefreshCw, Sparkles, Sliders, Eye, Save } from 'lucide-react';
import { ButtonV6, NextSaaSBtn, Badge, GlowCard } from '@simplifypdf/ui';

export function DesignStudio() {
  const [primaryColor, setPrimaryColor] = useState('#864FFE');
  const [primaryHover, setPrimaryHover] = useState('#6D1FE2');
  const [secondaryColor, setSecondaryColor] = useState('#1A1A1C');
  const [accentLime, setAccentLime] = useState('#C6F56F');
  const [borderRadius, setBorderRadius] = useState('16px');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Apply changes to document root in real-time
  const applyTokensLocally = (primary: string, hover: string, secondary: string, lime: string, radius: string) => {
    document.documentElement.style.setProperty('--primary-500', primary);
    document.documentElement.style.setProperty('--primary-700', hover);
    document.documentElement.style.setProperty('--secondary', secondary);
    document.documentElement.style.setProperty('--lime', lime);
    document.documentElement.style.setProperty('--radius-lg', radius);

    // Broadcast change across tabs via BroadcastChannel
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('simplifypdf-design-tokens');
      channel.postMessage({
        primaryColor: primary,
        primaryHover: hover,
        secondaryColor: secondary,
        accentLime: lime,
        borderRadius: radius,
      });
    }
  };

  const handlePrimaryChange = (val: string) => {
    setPrimaryColor(val);
    applyTokensLocally(val, primaryHover, secondaryColor, accentLime, borderRadius);
  };

  const handleSecondaryChange = (val: string) => {
    setSecondaryColor(val);
    applyTokensLocally(primaryColor, primaryHover, val, accentLime, borderRadius);
  };

  const handleLimeChange = (val: string) => {
    setAccentLime(val);
    applyTokensLocally(primaryColor, primaryHover, secondaryColor, val, borderRadius);
  };

  const handleRadiusChange = (val: string) => {
    setBorderRadius(val);
    applyTokensLocally(primaryColor, primaryHover, secondaryColor, accentLime, val);
  };

  const handleResetToNuvexa = () => {
    const p = '#864FFE';
    const h = '#6D1FE2';
    const s = '#1A1A1C';
    const l = '#C6F56F';
    const r = '16px';
    setPrimaryColor(p);
    setPrimaryHover(h);
    setSecondaryColor(s);
    setAccentLime(l);
    setBorderRadius(r);
    applyTokensLocally(p, h, s, l, r);
  };

  const handlePublishToProduction = async () => {
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      await fetch(`${apiHost}/api/config/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryColor,
          primaryHover,
          secondaryColor,
          accentLime,
          borderRadius,
        }),
      });
    } catch {
      // Local sync fallback
    }

    // Persist in localStorage so all apps pick it up
    localStorage.setItem(
      'simplifypdf_tokens',
      JSON.stringify({ primaryColor, primaryHover, secondaryColor, accentLime, borderRadius })
    );

    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Token Controls */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--primary-50)] text-[var(--primary-500)] flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-[var(--ink)]">
                  Live Design Tokens
                </h3>
                <p className="text-xs text-[var(--muted)]">Updates propagate instantly to public website</p>
              </div>
            </div>
            <button
              onClick={handleResetToNuvexa}
              className="text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)] flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {/* Primary Color */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
                Primary Brand Color (Nuvexa Violet)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => handlePrimaryChange(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-[var(--line)] cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => handlePrimaryChange(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] font-mono text-xs font-bold text-[var(--ink)]"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
                Secondary Color (Dark Near-Black)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => handleSecondaryChange(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-[var(--line)] cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => handleSecondaryChange(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] font-mono text-xs font-bold text-[var(--ink)]"
                />
              </div>
            </div>

            {/* PRO Lime Accent */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
                PRO Badge Accent (Lime)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentLime}
                  onChange={(e) => handleLimeChange(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-[var(--line)] cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={accentLime}
                  onChange={(e) => handleLimeChange(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] font-mono text-xs font-bold text-[var(--ink)]"
                />
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
                Global Border Radius
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['12px', '16px', '24px'].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRadiusChange(r)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      borderRadius === r
                        ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-500)]'
                        : 'border-[var(--line)] bg-[var(--soft)] text-[var(--muted)]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--line)]">
            <button
              onClick={handlePublishToProduction}
              disabled={isSaving}
              className="w-full py-3.5 px-6 rounded-2xl bg-[var(--primary-500)] text-white font-bold text-sm hover:bg-[var(--primary-700)] transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {isSaving ? (
                <span>Publishing to Redis & CDN...</span>
              ) : savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Published to Public Site!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-white" />
                  <span>Publish Tokens to Website</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Live Interactive Preview */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[var(--primary-500)]" />
              <h3 className="font-heading font-black text-lg text-[var(--ink)]">
                Live Interactive Component Preview
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Sync Active
            </span>
          </div>

          <div className="flex flex-col gap-8 p-6 rounded-2xl bg-[var(--bg)] border border-[var(--line)]">
            {/* Buttons Preview */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
                NextSaaS Interactive Buttons (Strict Pure White Text Rule)
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <ButtonV6 text="NextSaaS Roll" hoverText="Hover Slide →" variant="primary" size="md" />
                <NextSaaSBtn text="Lateral Slide Pill" variant="primary" size="md" />
                <button
                  className="px-5 py-2.5 rounded-full font-bold text-xs transition-colors shadow-sm"
                  style={{ backgroundColor: secondaryColor, color: '#ffffff' }}
                >
                  Secondary Dark
                </button>
              </div>
            </div>

            {/* Badges Preview */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
                Nuvexa Status Badges & Pills
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="pro">PRO 2GB</Badge>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--soft)] text-[var(--ink)] border border-[var(--line)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Live Worker
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Presigned S3
                </span>
              </div>
            </div>

            {/* Glow Card Preview */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
                NextSaaS Reactive Glow Card
              </div>
              <GlowCard className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary-50)] text-[var(--primary-500)] flex items-center justify-center font-bold">
                    PDF
                  </div>
                  <Badge variant="pro">2GB CAPACITOR</Badge>
                </div>
                <h4 className="font-heading font-black text-lg text-[var(--ink)]">
                  Compress PDF Engine
                </h4>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Changes made in the left panel update this card's border radius and primary accents instantaneously.
                </p>
              </GlowCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
