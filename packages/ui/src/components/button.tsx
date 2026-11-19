import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'roll' | 'lateral';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, icon, ...props }, ref) => {
    // 1. NextSaaS Rolling Flip Button (.btn-v6)
    if (variant === 'roll') {
      return (
        <button
          ref={ref}
          className={cn(
            'group relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium text-sm transition-all duration-300',
            'bg-[#864FFE] hover:bg-[#6D1FE2] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5',
            size === 'sm' ? 'px-4 py-1.5' : size === 'lg' ? 'px-8 py-3.5 text-base' : 'px-6 py-2.5',
            className
          )}
          {...props}
        >
          <div className="relative h-5 overflow-hidden leading-5">
            <span className="flex items-center gap-2 transition-transform duration-300 ease-in-out group-hover:-translate-y-full text-white">
              {children}
              {icon}
            </span>
            <span className="absolute inset-0 flex items-center gap-2 transition-transform duration-300 ease-in-out translate-y-full group-hover:translate-y-0 text-white">
              {children}
              {icon}
            </span>
          </div>
        </button>
      );
    }

    // 2. NextSaaS Lateral Arrow Slide Button (.nextsaas-btn)
    if (variant === 'lateral') {
      return (
        <button
          ref={ref}
          className={cn(
            'group relative inline-flex items-center justify-center gap-2.5 rounded-full font-medium text-sm transition-all duration-300 overflow-hidden',
            'bg-[#1A1A1C] hover:bg-[#11141D] text-white shadow-md hover:-translate-y-0.5',
            size === 'sm' ? 'px-4 py-1.5' : size === 'lg' ? 'px-8 py-3.5 text-base' : 'px-6 py-2.5',
            className
          )}
          {...props}
        >
          <span>{children}</span>
          <div className="relative w-4 h-4 overflow-hidden flex items-center justify-center">
            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:translate-x-full">
              {icon || '→'}
            </span>
            <span className="absolute inset-0 flex items-center justify-center -translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0">
              {icon || '→'}
            </span>
          </div>
        </button>
      );
    }

    // 3. Nuvexa Standard Buttons
    const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 cursor-pointer disabled:opacity-50';
    const sizeClasses = {
      sm: 'px-3.5 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3 text-base',
    };
    const variantClasses = {
      primary: 'bg-[#864FFE] hover:bg-[#6D1FE2] text-white shadow-md hover:-translate-y-0.5',
      secondary: 'bg-[#1A1A1C] hover:bg-[#11141D] text-white shadow',
      outline: 'bg-transparent text-[#20202A] dark:text-white border border-[#E4E4EA] dark:border-[#2A2A33] hover:bg-[#F4F0FF] dark:hover:bg-[#221A38]',
      ghost: 'bg-transparent text-[#686873] hover:text-[#20202A] hover:bg-[#F4F4F7]',
      roll: '',
      lateral: '',
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
        {...props}
      >
        {children}
        {icon}
      </button>
    );
  }
);
Button.displayName = 'Button';

export interface ButtonV6Props extends Omit<ButtonProps, 'children'> {
  text: string;
  hoverText?: string;
}

export function ButtonV6({ text, hoverText, ...props }: ButtonV6Props): React.JSX.Element {
  return (
    <Button variant="roll" {...props}>
      {text}
    </Button>
  );
}

export interface NextSaaSBtnProps extends Omit<ButtonProps, 'children'> {
  text: string;
}

export function NextSaaSBtn({ text, ...props }: NextSaaSBtnProps): React.JSX.Element {
  return (
    <Button variant="lateral" {...props}>
      {text}
    </Button>
  );
}
