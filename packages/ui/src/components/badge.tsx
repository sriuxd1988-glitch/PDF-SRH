import React from 'react';
import { cn } from './button';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'live' | 'pro' | 'outline' | 'neutral';
  dot?: boolean;
}

export function Badge({ className, variant = 'neutral', dot = false, children, ...props }: BadgeProps) {
  const variantStyles = {
    live: 'bg-[#F4F0FF] text-[#864FFE] border border-[#864FFE]/20',
    pro: 'bg-[#C6F56F] text-[#1A1A1C] font-bold uppercase tracking-wider',
    outline: 'bg-transparent text-[#20202A] dark:text-[#EEEEF3] border border-[#E4E4EA] dark:border-[#2A2A33]',
    neutral: 'bg-[#F4F4F7] dark:bg-[#1B1B22] text-[#686873] dark:text-[#AAAAB7]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium select-none',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="w-2 h-2 rounded-full bg-[#864FFE] animate-pulse shadow-[0_0_6px_#864FFE]" />
      )}
      {children}
    </span>
  );
}
