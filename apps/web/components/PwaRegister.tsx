'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SimplifyPDF PWA Service Worker registered:', registration.scope);
          })
          .catch((err) => {
            console.warn('Service Worker registration skipped or failed:', err);
          });
      });
    }
  }, []);

  return null;
}
