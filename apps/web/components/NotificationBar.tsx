'use client';

import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface NotificationBarProps {
  message?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function NotificationBar({
  message = 'SimplifyPDF 2.0 is live! Process up to 2GB PDFs with Nuvexa high-speed engines.',
  ctaText = 'Try PRO Free',
  ctaLink = '/pricing',
  backgroundColor = '#864FFE',
  textColor = '#FFFFFF',
}: NotificationBarProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      className="relative z-50 flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm font-medium transition-all"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="flex-1 flex items-center justify-center gap-2 text-center">
        <Sparkles className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" />
        <span>{message}</span>
        {ctaText && (
          <a
            href={ctaLink}
            className="underline underline-offset-4 font-bold ml-1 hover:opacity-90 transition-opacity"
            style={{ color: textColor }}
          >
            {ctaText} →
          </a>
        )}
      </div>
      <button
        onClick={() => setIsOpen(false)}
        className="shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
