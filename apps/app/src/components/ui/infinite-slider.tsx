'use client';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export function InfiniteSlider({
  children,
  duration = 30,
  gap = 48,
  className,
}: {
  children: ReactNode;
  duration?: number;
  gap?: number;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden flex flex-nowrap", className)}>
      <div
        className="flex items-center"
        style={{
          gap,
          animation: `iscroll ${duration}s linear infinite`,
        }}
      >
        <div className="flex shrink-0 items-center" style={{ gap }}>
          {children}
        </div>
        <div className="flex shrink-0 items-center" style={{ gap }}>
          {children}
        </div>
      </div>
      <style>{`@keyframes iscroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
