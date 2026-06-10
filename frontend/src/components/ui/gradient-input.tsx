import React from 'react';
import { cn } from '@/lib/utils';

export interface GradientInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const GradientInput = React.forwardRef<HTMLInputElement, GradientInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white/60 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-transparent opacity-0 rounded-full blur transition-opacity duration-300 group-focus-within:opacity-100 pointer-events-none" />
          <input
            ref={ref}
            className={cn(
              'relative w-full bg-[#0a0a0a] text-white border border-white/10 rounded-full py-3.5 px-5 focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20',
              error && 'border-red-500/50 focus:border-red-500/80',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
GradientInput.displayName = 'GradientInput';
