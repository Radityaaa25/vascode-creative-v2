'use client';
import { cn } from '@/lib/utils';

export function ProgressiveBlur({
  className,
  direction = 'left',
  blurIntensity = 1,
}: {
  className?: string;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  blurIntensity?: number;
}) {
  const gradient = direction === 'left' 
    ? 'to right' 
    : direction === 'right' 
      ? 'to left' 
      : direction === 'top' 
        ? 'to bottom' 
        : 'to top';
        
  return (
    <div 
      className={cn("pointer-events-none absolute z-10", className)} 
      style={{
        backdropFilter: `blur(${blurIntensity * 4}px)`,
        WebkitBackdropFilter: `blur(${blurIntensity * 4}px)`,
        maskImage: `linear-gradient(${gradient}, black, transparent)`,
        WebkitMaskImage: `linear-gradient(${gradient}, black, transparent)`,
      }}
    />
  );
}
