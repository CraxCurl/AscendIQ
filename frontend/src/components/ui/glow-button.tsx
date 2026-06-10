import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
  isLoading?: boolean;
}

export function GlowButton({
  className,
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props
}: GlowButtonProps) {
  return (
    <div className="relative group w-full sm:w-auto inline-block">
      {variant === 'primary' && !disabled && (
        <div className="absolute inset-0 -m-1 rounded-full bg-white opacity-20 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-40 group-hover:blur-xl group-hover:-m-2" />
      )}
      <button
        className={cn(
          'relative z-10 px-8 py-3.5 rounded-full text-base font-bold transition-all flex items-center justify-center gap-2',
          {
            'bg-white text-black hover:scale-105 disabled:hover:scale-100': variant === 'primary',
            'bg-[#111] text-white border border-white/20 hover:bg-white/10': variant === 'secondary',
            'bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-sm': variant === 'glass',
            'opacity-50 cursor-not-allowed': disabled || isLoading,
          },
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin" size={18} />}
        {!isLoading && children}
      </button>
    </div>
  );
}
