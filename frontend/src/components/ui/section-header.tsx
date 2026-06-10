import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function SectionHeader({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  ...props
}: SectionHeaderProps) {
  return (
    <header className={cn('mb-8 animate-slide-up', className)} {...props}>
      <h1 className={cn('text-4xl font-bold mb-3 tracking-tight glow-text text-white', titleClassName)}>
        {title}
      </h1>
      {description && (
        <p className={cn('text-white/50 text-lg', descriptionClassName)}>
          {description}
        </p>
      )}
    </header>
  );
}
