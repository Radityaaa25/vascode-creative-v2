'use client'

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Globe, Users, Layout, Image as ImageIcon, MessageCircle, ListOrdered, HelpCircle, Link2 } from "lucide-react"
import HeroTab from "@/components/content/hero-tab"
import StatsTab from "@/components/content/stats-tab"
import ServicesTab from "@/components/content/services-tab"
import PortfolioTab from "@/components/content/portfolio-tab"
import ContactTab from "@/components/content/contact-tab"
import CaraOrderTab from "@/components/content/cara-order-tab"
import FaqTab from "@/components/content/faq-tab"
import ToolsTab from "@/components/content/tools-tab"
import FooterTab from "@/components/content/footer-tab"

type Tab = "hero" | "stats" | "services" | "portfolio" | "contact" | "cara-order" | "faq" | "tools" | "footer"

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "hero", label: "Hero", icon: Globe },
  { id: "stats", label: "Stats", icon: Users },
  { id: "services", label: "Services", icon: Layout },
  { id: "portfolio", label: "Portfolio", icon: ImageIcon },
  { id: "contact", label: "Contact", icon: MessageCircle },
  { id: "cara-order", label: "Cara Order", icon: ListOrdered },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "tools", label: "Tools We Use", icon: Layout },
  { id: "footer", label: "Footer", icon: Link2 },
]

export default function ContentPage() {
  const [tab, setTab] = useState<Tab>("hero")
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  function handleTabChange(newTab: Tab) {
    if (isDirty && newTab !== tab) {
      if (!window.confirm('You have unsaved changes. Switch tabs?')) return
      setIsDirty(false)
    }
    setTab(newTab)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content <span className="text-gradient">CMS</span></h1>
        <p className="mt-1 text-sm text-white/50">Manage all site content — fully bilingual.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="glass h-fit space-y-1 rounded-2xl p-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition",
                tab === t.id ? "bg-primary/20 text-foreground" : "text-white/60 hover:bg-white/5 hover:text-foreground",
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "hero" && <HeroTab onDirtyChange={setIsDirty} />}
        {tab === "stats" && <StatsTab onDirtyChange={setIsDirty} />}
        {tab === "services" && <ServicesTab onDirtyChange={setIsDirty} />}
        {tab === "portfolio" && <PortfolioTab onDirtyChange={setIsDirty} />}
        {tab === "contact" && <ContactTab onDirtyChange={setIsDirty} />}
        {tab === "cara-order" && <CaraOrderTab onDirtyChange={setIsDirty} />}
        { tab === "faq" && <FaqTab onDirtyChange={setIsDirty} /> }
        { tab === "tools" && <ToolsTab onDirtyChange={setIsDirty} /> }
        { tab === "footer" && <FooterTab onDirtyChange={setIsDirty} /> }
      </div>
    </div>
  )
}
