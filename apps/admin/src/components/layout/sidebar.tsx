'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Settings, Sparkles, Menu, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/components/providers/language-provider'

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const items = [
    { title: t.sidebar.dashboard, href: "/", icon: LayoutDashboard },
    { title: t.sidebar.clients, href: "/clients", icon: Users },
    { title: t.sidebar.content, href: "/content", icon: FileText },
    { title: t.sidebar.settings, href: "/settings", icon: Settings },
  ] as const;

  return (
    <>
      {/* Invisible spacer to push content */}
      <div className={cn("hidden md:block shrink-0 transition-all duration-300", isExpanded ? "w-72" : "w-24")} />

      {/* Floating Sidebar */}
      <motion.aside 
        className={cn(
          "fixed left-4 top-4 bottom-4 z-40 hidden md:flex flex-col rounded-3xl border border-white/10 bg-[hsl(240_3%_13%)]/80 backdrop-blur-xl shadow-2xl transition-all duration-300 overflow-visible",
          isExpanded ? "w-64" : "w-16"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/5 px-4 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            {isExpanded ? (
              <img 
                src="/logo-full.png" 
                alt="Vascode Logo" 
                width={110} 
                height={28}
                className="object-contain shrink-0"
              />
            ) : (
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
                <Sparkles className="h-4 w-4 text-black" />
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white transition"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-3 flex flex-col items-center">
          {items.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <div 
                key={item.href} 
                className="relative w-full"
                onMouseEnter={() => !isExpanded && setHoveredItem(item.title)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center rounded-2xl transition-all overflow-hidden",
                    isExpanded ? "px-3 py-2.5 gap-3" : "justify-center h-10 w-10 mx-auto",
                    active
                      ? "bg-primary/15 text-foreground"
                      : "text-white/60 hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary to-accent" />
                  )}
                  <Icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-accent")} />
                  
                  {isExpanded && (
                    <span className="text-sm font-medium whitespace-nowrap">{item.title}</span>
                  )}
                </Link>

                {/* Floating Tooltip when collapsed */}
                {!isExpanded && (
                  <AnimatePresence>
                    {hoveredItem === item.title && (
                      <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-[52px] top-1/2 -translate-y-1/2 z-50 flex items-center"
                      >
                        <ChevronRight className="h-4 w-4 text-white/20 -mr-1 shrink-0" />
                        <div className="glass-strong rounded-xl px-3 py-2 text-sm font-semibold text-white whitespace-nowrap shadow-xl">
                          {item.title}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>

        {/* Status Indicator at bottom */}
        <div className="p-3 mt-auto border-t border-white/5 overflow-hidden">
          {isExpanded ? (
            <div className="glass rounded-2xl p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-white/70 whitespace-nowrap">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                All systems operational
              </div>
            </div>
          ) : (
            <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-full bg-white/5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}
