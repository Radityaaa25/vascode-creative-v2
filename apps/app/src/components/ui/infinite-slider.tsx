'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function InfiniteSlider({
  children,
  duration = 30,
  gap = 48,
  className,
  paused = false,
}: {
  children: ReactNode;
  duration?: number;
  gap?: number;
  className?: string;
  paused?: boolean;
}) {
  return (
    <div className={cn("overflow-hidden flex flex-nowrap", className)}>
      <motion.div
        className="flex shrink-0 items-center"
        style={{ gap, paddingRight: gap }}
        animate={paused ? { x: "0%" } : { x: ["0%", "-100%"] }}
        transition={paused ? { duration: 0 } : { ease: "linear", duration, repeat: Infinity }}
      >
        {children}
      </motion.div>
      <motion.div
        className="flex shrink-0 items-center"
        style={{ gap, paddingRight: gap }}
        animate={paused ? { x: "0%" } : { x: ["0%", "-100%"] }}
        transition={paused ? { duration: 0 } : { ease: "linear", duration, repeat: Infinity }}
      >
        {children}
      </motion.div>
    </div>
  );
}
