import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glowEffect?: boolean;
}

export function GlassCard({
  className,
  children,
  hoverEffect = true,
  glowEffect = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-panel p-6 relative overflow-hidden',
        hoverEffect && 'glass-panel-hover group',
        className
      )}
      {...props}
    >
      {glowEffect && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
