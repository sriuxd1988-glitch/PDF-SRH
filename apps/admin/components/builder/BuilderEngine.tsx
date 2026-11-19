'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  Sun,
  Moon,
  RotateCcw,
  Save,
  CheckCircle2,
  UploadCloud,
  X,
  History,
  Image,
  ExternalLink,
} from 'lucide-react';
import { ButtonV6, Badge } from '@simplifypdf/ui';

interface BuilderEngineProps {
  title: string;
  subtitle: string;
  previewUrl?: string;
  onPublish: () => void;
  children: React.ReactNode;
}

export function BuilderEngine({
  title,
  subtitle,
  previewUrl = 'http://localhost:3000',
  onPublish,
  children,
}: BuilderEngineProps) {
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [activeVersion, setActiveVersion] = useState('v1.4 (Current)');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const versions = [
    { id: 'v1.4', label: 'v1.4 (Current Live)', date: 'Today, 14:02' },
    { id: 'v1.3', label: 'v1.3 (Holiday Banner Rollback)', date: 'Nov 18, 2025' },
    { id: 'v1.2', label: 'v1.2 (Initial Release)', date: 'Nov 10, 2025' },
  ];

  const viewportWidths = {
    mobile: '375px',
    tablet: '768px',
    desktop: '100%',
  };

  const handlePublishClick = () => {
    setIsPublishing(true);
    setPublishedSuccess(false);
    onPublish();
    setTimeout(() => {
      setIsPublishing(false);
      setPublishedSuccess(true);
      setTimeout(() => setPublishedSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Builder Control Header */}
      <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-heading font-black text-2xl text-[var(--ink)]">{title}</h2>
            <Badge variant="live" dot>LIVE DRAFT STAGING</Badge>
          </div>
          <p className="text-xs text-[var(--muted)] mt-1">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Media Library Trigger */}
          <button
            onClick={() => setIsMediaModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:bg-[var(--line)] text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1.5 transition-colors"
          >
            <Image className="w-4 h-4 text-[var(--primary-500)]" />
            <span>Media Library</span>
          </button>

          {/* Version Rollback Dropdown */}
          <select
            value={activeVersion}
            onChange={(e) => {
              setActiveVersion(e.target.value);
              alert(`Rolled back draft configuration to ${e.target.value}.`);
            }}
            className="px-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs font-bold text-[var(--ink)]"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.label}>
                {v.label}
              </option>
            ))}
          </select>

          {/* Publish Button */}
          <button
            onClick={handlePublishClick}
            disabled={isPublishing}
            className="px-6 py-2.5 rounded-2xl bg-[var(--primary-500)] text-white font-bold text-xs hover:bg-[var(--primary-700)] transition-all inline-flex items-center gap-2 shadow-sm"
          >
            <Save className="w-3.5 h-3.5 text-white" />
            <span>{isPublishing ? 'Publishing Cache...' : 'Publish to Production'}</span>
          </button>
        </div>
      </div>

      {publishedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Configuration saved to PostgreSQL and Redis cache evicted! Public website updated immediately.</span>
        </div>
      )}

      {/* Main Split Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Controls Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {children}
        </div>

        {/* Right Live Responsive Preview Panel */}
        <div className="lg:col-span-7 flex flex-col gap-3 sticky top-20">
          {/* Viewport & Theme Switcher Bar */}
          <div className="p-3 rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-1 bg-[var(--soft)] p-1 rounded-xl border border-[var(--line)]">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewport === 'desktop' ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
                }`}
                title="Desktop View (1280px)"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewport === 'tablet' ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewport === 'mobile' ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[var(--soft)] p-1 rounded-xl border border-[var(--line)]">
                <button
                  onClick={() => setPreviewTheme('light')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    previewTheme === 'light' ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
                  }`}
                  title="Light Theme"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewTheme('dark')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    previewTheme === 'dark' ? 'bg-[var(--card)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted)]'
                  }`}
                  title="Dark Theme"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>

              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--muted)] hover:text-[var(--ink)]"
                title="Open in new window"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Preview Container Frame */}
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-lg overflow-hidden flex flex-col items-center justify-center p-2 min-h-[580px]">
            <div
              className="h-[560px] bg-[var(--bg)] border border-[var(--line)] rounded-2xl overflow-hidden transition-all duration-300 w-full flex flex-col"
              style={{ maxWidth: viewportWidths[viewport] }}
            >
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="Live Website Preview"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Media Library Modal */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[var(--card)] border border-[var(--line)] rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6">
            <button
              onClick={() => setIsMediaModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full border border-[var(--line)] bg-[var(--soft)] hover:bg-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="font-heading font-black text-2xl text-[var(--ink)]">
                Media Asset Library
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1">
                Upload brand logos, marketing illustrations, or pick royalty-free stock photography.
              </p>
            </div>

            <div className="p-8 border-2 border-dashed border-[var(--line)] rounded-2xl text-center flex flex-col items-center gap-2 cursor-pointer hover:border-[var(--primary-500)] bg-[var(--soft)]">
              <UploadCloud className="w-8 h-8 text-[var(--primary-500)]" />
              <span className="text-xs font-bold text-[var(--ink)]">
                Drop image to upload to MinIO S3 media bucket
              </span>
              <span className="text-[10px] text-[var(--muted)]">PNG, SVG, WEBP, or JPG up to 10MB</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'logo_full_dark.svg', size: '14 KB' },
                { name: 'nuvexa_hero_vector.png', size: '240 KB' },
                { name: 'trust_badge_iso27001.svg', size: '8 KB' },
              ].map((img, i) => (
                <div
                  key={i}
                  onClick={() => {
                    alert(`Selected ${img.name}`);
                    setIsMediaModalOpen(false);
                  }}
                  className="p-3 rounded-xl border border-[var(--line)] bg-[var(--card)] hover:border-[var(--primary-500)] cursor-pointer text-xs"
                >
                  <span className="font-bold text-[var(--ink)] block truncate">{img.name}</span>
                  <span className="text-[10px] text-[var(--muted)]">{img.size}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
