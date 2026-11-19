import React from 'react';
import { Button } from '../button';

export interface SplitAuthProps {
  mode?: 'login' | 'signup';
  siteName?: string;
  onGoogleSignIn?: () => void;
  onSubmitEmail?: (email: string, password: string) => void;
  onToggleMode?: () => void;
}

export function SplitAuth({
  mode = 'login',
  siteName = 'SimplifyPDF',
  onGoogleSignIn,
  onSubmitEmail,
  onToggleMode,
}: SplitAuthProps) {
  const isLogin = mode === 'login';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] min-h-screen bg-[#FAF9F7] dark:bg-[#0B0B10] text-[#20202A] dark:text-[#EEEEF3]">
      {/* Left Column: Form Shell */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-lg mx-auto w-full">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6D1FE2] to-[#864FFE] text-white flex items-center justify-center font-bold text-sm shadow">
              SP
            </div>
            <span className="font-heading font-bold text-lg tracking-tight">{siteName}</span>
          </div>
          <span className="text-xs text-[#686873] dark:text-[#AAAAB7]">
            {isLogin ? 'No account? ' : 'Already have an account? '}
            <button
              type="button"
              onClick={onToggleMode}
              className="font-semibold text-[#864FFE] hover:underline cursor-pointer"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </span>
        </div>

        {/* Center Form Container */}
        <div className="space-y-6 my-auto">
          <div>
            <h1 className="font-heading font-bold text-3xl tracking-tight mb-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-[#686873] dark:text-[#AAAAB7] font-normal">
              {isLogin
                ? `Sign in to access your private ${siteName} workspace.`
                : `Start processing files with free daily quota and zero ad clutter.`}
            </p>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={onGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#E4E4EA] dark:border-[#2A2A33] bg-white dark:bg-[#141419] font-semibold text-sm hover:bg-[#F4F4F7] dark:hover:bg-[#1B1B22] transition-colors shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E4E4EA] dark:bg-[#2A2A33]" />
            <span className="text-xs text-[#686873] dark:text-[#AAAAB7] uppercase font-mono tracking-wider">
              or with email
            </span>
            <div className="flex-1 h-px bg-[#E4E4EA] dark:bg-[#2A2A33]" />
          </div>

          {/* Form fields */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (onSubmitEmail) onSubmitEmail('user@example.com', 'password');
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-[#20202A] dark:text-[#EEEEF3]">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl border border-[#E4E4EA] dark:border-[#2A2A33] bg-[#F7F7F9] dark:bg-[#202028] text-sm focus:outline-none focus:ring-2 focus:ring-[#864FFE]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 text-[#20202A] dark:text-[#EEEEF3]">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[#E4E4EA] dark:border-[#2A2A33] bg-[#F7F7F9] dark:bg-[#202028] text-sm focus:outline-none focus:ring-2 focus:ring-[#864FFE]"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#686873] dark:text-[#AAAAB7]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded accent-[#864FFE]" />
                Remember me
              </label>
              {isLogin && (
                <a href="#forgot" className="text-[#864FFE] hover:underline font-semibold">
                  Forgot password?
                </a>
              )}
            </div>

            {/* Primary Action Button (Strictly Pure White Text) */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full !text-white font-bold py-3.5 shadow-md"
            >
              {isLogin ? 'Sign in to Workspace' : 'Create Free Account'}
            </Button>
          </form>

          {/* Security Trust Microcopy */}
          <p className="text-center text-xs text-[#686873] dark:text-[#AAAAB7] flex items-center justify-center gap-1.5 pt-2">
            <span>🔒</span>
            <span>256-bit SSL encrypted · India DPDP Act & GDPR ready</span>
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="text-xs text-[#686873] dark:text-[#AAAAB7] mt-8">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </div>

      {/* Right Column: Premium Nuvexa Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 m-4 rounded-[24px] bg-gradient-to-br from-[#1A1A1C] via-[#6D1FE2] to-[#864FFE] text-white shadow-2xl relative overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-white/15 border border-white/20 mb-6">
            {siteName.toUpperCase()} · MASTER WORKSPACE
          </span>
          <h2 className="font-heading font-bold text-4xl leading-tight max-w-md mb-4 text-white tracking-tight">
            Every document. Every PDF job. One click.
          </h2>
          <p className="text-white/80 text-sm max-w-sm font-normal leading-relaxed">
            Ultra-fast, ad-free PDF conversion, extreme compression, e-signing, and optical character recognition in a privacy-first sandbox.
          </p>
        </div>

        {/* Floating Mock Task Result Card */}
        <div className="relative z-10 bg-black/30 backdrop-blur-md border border-white/20 p-5 rounded-2xl max-w-md shadow-xl my-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-emerald-300 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Direct Presigned S3 Processed
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C6F56F] text-[#1A1A1C]">
              PRO SPEED
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white">
              PDF
            </div>
            <div>
              <p className="font-bold text-sm text-white">Quarterly_Financials_Q4.pdf</p>
              <p className="text-xs text-white/70">Reduced by 72% · AES-256 Encrypted</p>
            </div>
          </div>
        </div>

        {/* Brand Feature Chips */}
        <div className="relative z-10 flex flex-wrap gap-2.5">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/15 border border-white/20">
            ⚡ 2GB File Limits
          </span>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/15 border border-white/20">
            📦 Batch Processing ZIP
          </span>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/15 border border-white/20">
            🚫 100% Zero Ads
          </span>
        </div>
      </div>
    </div>
  );
}
