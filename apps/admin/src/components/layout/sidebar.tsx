'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Settings, Menu, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/components/providers/language-provider'

const navItems = [
  { href: "/", icon: LayoutDashboard },
  { href: "/clients", icon: Users },
  { href: "/content", icon: FileText },
  { href: "/settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const items = [
    { title: t.sidebar.dashboard, href: "/", icon: LayoutDashboard },
    { title: t.sidebar.clients, href: "/clients", icon: Users },
    { title: t.sidebar.content, href: "/content", icon: FileText },
    { title: t.sidebar.settings, href: "/settings", icon: Settings },
  ] as const;

  const activeHref = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Desktop spacer */}
      <motion.div
        className="hidden md:block shrink-0"
        animate={{ width: isExpanded ? 288 : 96 }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      />

      {/* Desktop sidebar */}
      <motion.aside
        className="fixed left-4 top-4 bottom-4 z-40 hidden md:flex flex-col rounded-3xl border border-white/10 bg-[hsl(240_3%_13%)]/80 backdrop-blur-xl shadow-2xl overflow-visible"
        animate={{ width: isExpanded ? 256 : 64 }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/5 px-4 shrink-0 overflow-hidden">
          <div className="relative flex items-center w-full h-8">
            <img
              src="/logo-full.png" alt="Vascode Logo" width={110} height={28}
              className="absolute left-0 object-contain transition-all duration-300"
              style={{ opacity: isExpanded ? 1 : 0, transform: `scale(${isExpanded ? 1 : 0.8})` }}
            />
            <img
              src="/logo-icon.png" alt="Vascode" width={28} height={28}
              className="absolute left-0 object-contain transition-all duration-300"
              style={{ opacity: isExpanded ? 0 : 1, transform: `scale(${isExpanded ? 0.8 : 1})` }}
            />
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white transition"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isExpanded}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <nav aria-label="Main navigation" className="flex-1 space-y-2 p-3 flex flex-col items-center">
          {items.map((item) => {
            const active = activeHref(item.href);
            const Icon = item.icon;
            return (
              <motion.div key={item.href} layout className="relative w-full"
                onMouseEnter={() => !isExpanded && setHoveredItem(item.title)}
                onMouseLeave={() => setHoveredItem(null)}
                onFocus={() => !isExpanded && setHoveredItem(item.title)}
                onBlur={() => setHoveredItem(null)}
              >
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center rounded-2xl transition-all overflow-hidden",
                    isExpanded ? "px-3 py-2.5 gap-3" : "justify-center h-10 w-10 mx-auto",
                    active ? "bg-primary/15 text-foreground" : "text-white/60 hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  {active && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary to-accent" />}
                  <Icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-accent")} />
                  <AnimatePresence mode="popLayout">
                    {isExpanded && (
                      <motion.span key="label" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.12 }}
                        className="text-sm font-medium whitespace-nowrap">{item.title}</motion.span>
                    )}
                  </AnimatePresence>
                </Link>
                {!isExpanded && (
                  <AnimatePresence>
                    {hoveredItem === item.title && (
                      <motion.div initial={{ opacity: 0, x: -10, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -10, scale: 0.9 }} transition={{ duration: 0.12 }}
                        className="absolute left-[52px] top-1/2 -translate-y-1/2 z-50 flex items-center pointer-events-none">
                        <ChevronRight className="h-4 w-4 text-white/20 -mr-1 shrink-0" />
                        <div className="glass-strong rounded-xl px-3 py-2 text-sm font-semibold text-white whitespace-nowrap shadow-xl">{item.title}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            );
          })}
        </nav>

        <div className="p-3 mt-auto border-t border-white/5 overflow-hidden hidden">
          <div className="flex items-center gap-2 text-xs font-medium text-white/70 whitespace-nowrap">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            All systems operational
          </div>
        </div>
      </motion.aside>

      {/* Mobile bottom nav */}
      <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-50 flex md:hidden items-center justify-around border-t border-white/10 bg-[hsl(240_3%_13%)]/95 backdrop-blur-xl px-2 pb-safe-area">
        {navItems.map(({ href, icon: Icon }) => {
          const active = activeHref(href);
          return (
            <Link key={href} href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-colors min-w-0",
                active ? "text-accent" : "text-white/50 hover:text-white/80",
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </nav>
      {/* Spacer for mobile bottom nav */}
      <div className="h-16 md:hidden" />
    </>
  );
}
