import React from 'react';
import { ShieldCheck, Lock, Trash2, EyeOff, Server, FileCheck } from 'lucide-react';
import { Badge, GlowCard } from '@simplifypdf/ui';

export const metadata = {
  title: 'Security, Privacy & Data Compliance — SimplifyPDF',
  description: 'Learn how SimplifyPDF guarantees 100% automated file shredding, zero-log passwords, and permissive open-source processing.',
};

export default function SecurityPage() {
  const pillars = [
    {
      icon: Trash2,
      title: 'Automated 2h/24h File Shredding',
      desc: 'All uploaded and processed documents are permanently destroyed from S3 storage after 2 hours (Free) or 24 hours (Pro). Zero lingering backups.',
    },
    {
      icon: EyeOff,
      title: 'Zero Telemetry & Zero Logging',
      desc: 'We never read, analyze, or train models on user documents. All processing runs in isolated memory sandboxes that are wiped upon task completion.',
    },
    {
      icon: Lock,
      title: '256-bit AES Direct S3 Presigned Uploads',
      desc: 'Documents upload directly from your browser to MinIO S3 using short-lived presigned URLs over TLS 1.3 encryption, bypassing server proxy memory.',
    },
    {
      icon: Server,
      title: '100% Permissive Open-Source Engines',
      desc: 'No viral AGPL libraries or closed commercial code. Powered exclusively by pypdfium2, pikepdf, qpdf, and pdf2docx.',
    },
    {
      icon: FileCheck,
      title: 'ClamAV Malware Stream Guard',
      desc: 'Every file is scanned via ClamAV before processing. Infected files are quarantined and immediately deleted from storage.',
    },
    {
      icon: ShieldCheck,
      title: 'India DPDP & GDPR Ready',
      desc: 'Full regulatory compliance with statutory rights to immediate deletion, zero tracking cookies, and transparent data processing guarantees.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 flex flex-col gap-16">
      <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-3">
        <Badge variant="pro">TRUST & SECURITY ARCHITECTURE</Badge>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-[var(--ink)] tracking-tight">
          Privacy-First Document Processing
        </h1>
        <p className="text-base sm:text-lg text-[var(--muted)]">
          Built for legal teams, enterprises, and privacy-conscious professionals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <GlowCard key={i} className="p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--primary-50)] text-[var(--primary-500)] flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-xl text-[var(--ink)]">
                {p.title}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {p.desc}
              </p>
            </GlowCard>
          );
        })}
      </div>
    </div>
  );
}
