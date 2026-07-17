'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Loader2, Globe, Video, Camera, Palette, Film, Monitor, Smartphone, PenTool, Image, Music, Code, Layout, Megaphone, BookOpen, ShoppingBag, Users, MessageCircle, Mail, Instagram, MessageSquare, ArrowRight, ExternalLink, FileText, CreditCard, Settings, CheckCircle2, Sparkles, Eye } from "lucide-react"

export type Lang = "ID" | "EN"

export const ICON_OPTIONS = [
  "Globe", "Video", "Camera", "Palette", "Film", "Monitor", "Smartphone",
  "PenTool", "Image", "Music", "Code", "Layout", "Megaphone", "BookOpen",
  "ShoppingBag", "Users", "MessageCircle", "ArrowRight", "ExternalLink",
  "FileText", "MessageSquare", "CreditCard", "Settings", "CheckCircle2", "Sparkles", "Eye",
  "Mail", "Instagram",
] as const

export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Video, Camera, Palette, Film, Monitor, Smartphone,
  PenTool, Image, Music, Code, Layout, Megaphone, BookOpen,
  ShoppingBag, Users, MessageCircle, ArrowRight, ExternalLink,
  FileText, MessageSquare, CreditCard, Settings, CheckCircle2, Sparkles, Eye,
  Mail, Instagram,
}

export const CATEGORIES = ["Website", "Foto/Video", "Desain", "Editing Video", "Lainnya"] as const

export function ConfirmDelete({ open, title, onConfirm, onCancel, deleting }: {
  open: boolean; title: string; onConfirm: () => void; onCancel: () => void; deleting: boolean
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-center text-lg font-bold">Delete {title}?</h3>
            <p className="mb-6 text-center text-sm text-white/60">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={onCancel} disabled={deleting} className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium hover:bg-white/10 disabled:opacity-50">Cancel</button>
              <button onClick={onConfirm} disabled={deleting} className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground hover:brightness-110 disabled:opacity-50">
                {deleting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Delete"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-0.5 text-[11px] font-semibold">
      {(["ID", "EN"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            "rounded-full px-2.5 py-0.5 transition",
            lang === l ? "bg-primary text-primary-foreground" : "text-white/50 hover:text-foreground",
          )}
        >{l}</button>
      ))}
    </div>
  )
}

export function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  const Element = textarea ? "textarea" : "input"
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">{label}</label>
      <Element
        value={value}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        rows={textarea ? 4 : undefined}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )
}

export function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const Icon = ICON_MAP[value]
  return (
    <div className="relative">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">Icon</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm hover:bg-white/10"
      >
        {Icon && <Icon className="h-4 w-4" />}
        <span>{value || "Select icon..."}</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 grid grid-cols-6 gap-1 rounded-xl border border-white/10 bg-background p-2 shadow-2xl">
          {ICON_OPTIONS.map((name) => {
            const I = ICON_MAP[name]
            return (
              <button
                key={name}
                type="button"
                onClick={() => { onChange(name); setOpen(false) }}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-lg text-xs transition hover:bg-white/10",
                  value === name ? "bg-primary/20 text-primary" : "text-white/60",
                )}
                title={name}
              >
                {I && <I className="h-4 w-4" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
