'use client';

import React, { useEffect } from 'react';

export function DesignTokenSync() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const applyTokens = (tokens: any) => {
      if (!tokens) return;
      const root = document.documentElement;
      if (tokens.primaryColor) root.style.setProperty('--primary-500', tokens.primaryColor);
      if (tokens.primaryHover) root.style.setProperty('--primary-700', tokens.primaryHover);
      if (tokens.secondaryColor) root.style.setProperty('--secondary', tokens.secondaryColor);
      if (tokens.accentLime) root.style.setProperty('--lime', tokens.accentLime);
      if (tokens.accentCyan) root.style.setProperty('--cyan', tokens.accentCyan);
      if (tokens.accentYellow) root.style.setProperty('--yellow', tokens.accentYellow);
      if (tokens.borderRadius) root.style.setProperty('--radius-lg', tokens.borderRadius);
    };

    // 1. Load initial tokens from localStorage
    try {
      const stored = localStorage.getItem('simplifypdf_tokens');
      if (stored) {
        applyTokens(JSON.parse(stored));
      }
    } catch (e) {}

    // 2. BroadcastChannel cross-tab live listener
    let channel: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('simplifypdf-design-tokens');
        channel.onmessage = (event) => {
          if (event.data) {
            applyTokens(event.data);
          }
        };
      } catch (e) {}
    }

    // 3. Storage event listener (cross-window)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'simplifypdf_tokens' && e.newValue) {
        try {
          applyTokens(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // 4. PostMessage listener (for live iframe previews from Admin Studio)
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'SIMPLIFYPDF_TOKEN_UPDATE') {
        applyTokens(e.data.tokens);
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return null;
}
