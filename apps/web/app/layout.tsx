import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import '@simplifypdf/ui/styles/tokens.css';
import './globals.css';
import { NotificationBar } from '../components/NotificationBar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { DesignTokenSync } from '@simplifypdf/ui';
import { PwaRegister } from '../components/PwaRegister';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-heading' });

export const viewport: Viewport = {
  themeColor: '#864FFE',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'SimplifyPDF — High-Speed, Permissive Open-Source PDF Platform',
  description: 'Compress, merge, split, convert, and sign PDF documents directly in your browser. Powered by 100% permissive open-source engines.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SimplifyPDF',
  },
  icons: {
    icon: '/icons/icon-192.svg',
    apple: '/icons/icon-192.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <head>
        <link rel="icon" href="/icons/icon-192.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#864FFE" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SimplifyPDF" />
      </head>
      <body className="bg-[var(--bg)] text-[var(--text)] min-h-screen flex flex-col font-body antialiased transition-colors">
        <PwaRegister />
        <DesignTokenSync />
        <NotificationBar />
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
