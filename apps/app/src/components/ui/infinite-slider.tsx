'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
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
      <motion.div
        className="flex shrink-0 items-center"
        style={{ gap, paddingRight: gap }}
        animate={{ x: ["0%", "-100%"] }}
        transition={{ ease: "linear", duration, repeat: Infinity }}
      >
        {children}
      </motion.div>
      <motion.div
        className="flex shrink-0 items-center"
        style={{ gap, paddingRight: gap }}
        animate={{ x: ["0%", "-100%"] }}
        transition={{ ease: "linear", duration, repeat: Infinity }}
      >
        {children}
      </motion.div>
    </div>
  );
}
