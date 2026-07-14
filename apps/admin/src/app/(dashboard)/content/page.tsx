'use client'

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Plus, Save, Pencil, X, Loader2, Globe, Video, Camera, Palette, Film, Monitor, Smartphone, PenTool, Image, Music, Code, Layout, Megaphone, BookOpen, ShoppingBag, Users, MessageCircle, Instagram, Mail, ExternalLink, Eye, EyeOff } from "lucide-react"
import AnimatedDeleteButton from "@/components/ui/animated-delete-button"
import { getSettings, updateSettings, getStats, createStat, updateStat, deleteStat, getServices, createService, updateService, deleteService, getProjects, createProject, updateProject, deleteProject, type SettingRow, type StatRow, type ServiceRow, type ProjectRow } from "@/app/actions/content"

type Tab = "hero" | "stats" | "services" | "portfolio" | "contact"
type Lang = "ID" | "EN"

const ICON_OPTIONS = [
  "Globe", "Video", "Camera", "Palette", "Film", "Monitor", "Smartphone",
  "PenTool", "Image", "Music", "Code", "Layout", "Megaphone", "BookOpen",
  "ShoppingBag", "Users", "MessageCircle",
] as const

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Video, Camera, Palette, Film, Monitor, Smartphone,
  PenTool, Image, Music, Code, Layout, Megaphone, BookOpen,
  ShoppingBag, Users, MessageCircle,
}

const CATEGORIES = ["Website", "Foto/Video", "Desain", "Editing Video", "Lainnya"] as const

type CategoryItem = { name: string; visible: boolean }

function ConfirmDelete({ open, title, onConfirm, onCancel, deleting }: {
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
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-destructive/20 text-destructive mx-auto">
              <svg viewBox="0 0 69 76" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                <path fill="currentColor" d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"/>
              </svg>
            </div>
            <h3 className="mb-2 text-center text-lg font-bold">Delete {title}?</h3>
            <p className="mb-6 text-center text-sm text-white/60">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={deleting}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium hover:bg-white/10 disabled:opacity-50"
              >Cancel</button>
              <button
                onClick={onConfirm}
                disabled={deleting}
                className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground hover:brightness-110 disabled:opacity-50"
              >
                {deleting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Delete"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ContentPage() {
  const [tab, setTab] = useState<Tab>("hero")

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content <span className="text-gradient">CMS</span></h1>
        <p className="mt-1 text-sm text-white/50">Manage all site content — fully bilingual.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="glass h-fit space-y-1 rounded-2xl p-2">
          {([
            { id: "hero" as Tab, label: "Hero", icon: Globe },
            { id: "stats" as Tab, label: "Stats", icon: Users },
            { id: "services" as Tab, label: "Services", icon: Layout },
            { id: "portfolio" as Tab, label: "Portfolio", icon: Image },
            { id: "contact" as Tab, label: "Contact", icon: MessageCircle },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
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

        {tab === "hero" && <HeroTab />}
        {tab === "stats" && <StatsTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "portfolio" && <PortfolioTab />}
        {tab === "contact" && <ContactTab />}
      </div>
    </div>
  )
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
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

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
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

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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

/* ─── HERO TAB ─── */
function HeroTab() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [lang, setLang] = useState<Lang>("ID")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings().then((res) => {
      if (res.success) {
        const map: Record<string, string> = {}
        res.data.forEach((s) => { map[s.key] = s.value })
        setSettings(map)
      } else toast.error(res.error)
      setLoading(false)
    })
  }, [])

  const set = (key: string) => (val: string) => setSettings((s) => ({ ...s, [key]: val }))

  async function handleSave() {
    setSaving(true)
    const keys = ["hero_title_id", "hero_title_en", "hero_desc_id", "hero_desc_en", "hero_cta1_id", "hero_cta1_en", "hero_cta2_id", "hero_cta2_en"]
    const updates = keys.map((k) => ({ key: k, value: settings[k] || "" }))
    const res = await updateSettings(updates)
    setSaving(false)
    if (res.success) toast.success("Hero content saved")
    else toast.error(res.error)
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-white/40"><Loader2 className="h-5 w-5 animate-spin" /></div>

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass space-y-5 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Hero Section</h2>
        <LangToggle lang={lang} setLang={setLang} />
      </div>

      <Field label="Title" value={settings[`hero_title_${lang.toLowerCase()}`] || ""} onChange={set(`hero_title_${lang.toLowerCase()}`)} />
      <Field label="Description" value={settings[`hero_desc_${lang.toLowerCase()}`] || ""} onChange={set(`hero_desc_${lang.toLowerCase()}`)} textarea />
      <Field label="CTA Button (Primary)" value={settings[`hero_cta1_${lang.toLowerCase()}`] || ""} onChange={set(`hero_cta1_${lang.toLowerCase()}`)} />
      <Field label="CTA Button (Secondary)" value={settings[`hero_cta2_${lang.toLowerCase()}`] || ""} onChange={set(`hero_cta2_${lang.toLowerCase()}`)} />

      <div className="flex items-center gap-3 pt-2">
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>
    </motion.div>
  )
}

/* ─── STATS TAB ─── */
function StatsTab() {
  const [stats, setStats] = useState<StatRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ label_id: "", label_en: "", value: "" })
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function fetchData() {
    setLoading(true)
    const res = await getStats()
    if (res.success) setStats(res.data)
    else toast.error(res.error)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function resetForm() { setForm({ label_id: "", label_en: "", value: "" }); setEditId(null) }

  async function handleSave() {
    if (!form.label_id || !form.label_en || !form.value) { toast.error("All fields required"); return }
    setSaving(true)
    const res = editId ? await updateStat(editId, form) : await createStat(form)
    setSaving(false)
    if (res.success) { toast.success(editId ? "Updated" : "Created"); resetForm(); fetchData() }
    else toast.error(res.error)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await deleteStat(deleteTarget)
    setDeleting(false)
    if (res.success) { toast.success("Deleted"); setDeleteTarget(null); fetchData() }
    else toast.error(res.error)
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-white/40"><Loader2 className="h-5 w-5 animate-spin" /></div>

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <h2 className="mb-4 text-lg font-bold">About Stats</h2>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
        <input value={form.label_id} onChange={(e) => setForm({ ...form, label_id: e.target.value })} placeholder="Label (ID)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
        <input value={form.label_en} onChange={(e) => setForm({ ...form, label_en: e.target.value })} placeholder="Label (EN)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
        <input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="Value (e.g. 50+)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
        <button onClick={handleSave} disabled={saving} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? "Update" : "Add"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/8 text-xs uppercase tracking-wider text-white/50">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Label (ID)</th>
              <th className="px-3 py-2">Label (EN)</th>
              <th className="px-3 py-2">Value</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => (
              <tr key={s.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                <td className="px-3 py-3 text-white/40">{i + 1}</td>
                <td className="px-3 py-3 font-medium">{s.label_id}</td>
                <td className="px-3 py-3 text-white/70">{s.label_en}</td>
                <td className="px-3 py-3">
                  <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-bold text-accent">{s.value}</span>
                </td>
                <td className="px-3 py-3 text-right">
                  <button onClick={() => { setEditId(s.id); setForm({ label_id: s.label_id, label_en: s.label_en, value: s.value }) }} className="mr-1 grid h-7 w-7 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                  <AnimatedDeleteButton size="sm" onClick={() => setDeleteTarget(s.id)} />
                </td>
              </tr>
            ))}
            {stats.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-8 text-center text-white/30">No stats yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDelete open={!!deleteTarget} title="Stat" onConfirm={confirmDelete} onCancel={() => { setDeleteTarget(null); setDeleting(false) }} deleting={deleting} />
    </motion.div>
  )
}

/* ─── SERVICES TAB ─── */
function ServicesTab() {
  const [services, setServices] = useState<ServiceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [lang, setLang] = useState<Lang>("ID")
  const [form, setForm] = useState({ title_id: "", title_en: "", icon: "Globe", description_id: "", description_en: "", wa_template_id: "", wa_template_en: "" })
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function fetchData() {
    setLoading(true)
    const res = await getServices()
    if (res.success) setServices(res.data)
    else toast.error(res.error)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function resetForm() { setForm({ title_id: "", title_en: "", icon: "Globe", description_id: "", description_en: "", wa_template_id: "", wa_template_en: "" }); setEditId(null) }

  async function handleSave() {
    if (!form.title_id || !form.title_en) { toast.error("Title required in both languages"); return }
    setSaving(true)
    const res = editId ? await updateService(editId, form) : await createService(form)
    setSaving(false)
    if (res.success) { toast.success(editId ? "Updated" : "Created"); resetForm(); fetchData() }
    else toast.error(res.error)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await deleteService(deleteTarget)
    setDeleting(false)
    if (res.success) { toast.success("Deleted"); setDeleteTarget(null); fetchData() }
    else toast.error(res.error)
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-white/40"><Loader2 className="h-5 w-5 animate-spin" /></div>

  const currentDesc = lang === "ID" ? form.description_id : form.description_en
  const currentWa = lang === "ID" ? form.wa_template_id : form.wa_template_en
  const setDesc = (v: string) => setForm({ ...form, [lang === "ID" ? "description_id" : "description_en"]: v })
  const setWa = (v: string) => setForm({ ...form, [lang === "ID" ? "wa_template_id" : "wa_template_en"]: v })

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Services</h2>
        <LangToggle lang={lang} setLang={setLang} />
      </div>

      <div className="mb-6 space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input value={form.title_id} onChange={(e) => setForm({ ...form, title_id: e.target.value })} placeholder="Title (ID)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
          <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} placeholder="Title (EN)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <IconPicker value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} />
        <Field label="Description" value={currentDesc} onChange={setDesc} textarea />
        <Field label="WhatsApp Template" value={currentWa} onChange={setWa} textarea />
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? "Update" : "Add"} Service
          </button>
          {editId && <button onClick={resetForm} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5">Cancel</button>}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/8 text-xs uppercase tracking-wider text-white/50">
            <tr>
              <th className="px-3 py-2">Icon</th>
              <th className="px-3 py-2">Title (ID)</th>
              <th className="px-3 py-2">Title (EN)</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => {
              const IconComp = ICON_MAP[s.icon]
              return (
                <tr key={s.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                  <td className="px-3 py-3">{IconComp ? <IconComp className="h-4 w-4 text-primary" /> : <span className="text-white/30">{s.icon}</span>}</td>
                  <td className="px-3 py-3 font-medium">{s.title_id}</td>
                  <td className="px-3 py-3 text-white/70">{s.title_en}</td>
                  <td className="px-3 py-3 text-right">
                    <button onClick={() => { setEditId(s.id); setForm({ title_id: s.title_id, title_en: s.title_en, icon: s.icon, description_id: s.description_id, description_en: s.description_en, wa_template_id: s.wa_template_id, wa_template_en: s.wa_template_en }) }} className="mr-1 grid h-7 w-7 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                    <AnimatedDeleteButton size="sm" onClick={() => setDeleteTarget(s.id)} />
                  </td>
                </tr>
              )
            })}
            {services.length === 0 && (
              <tr><td colSpan={4} className="px-3 py-8 text-center text-white/30">No services yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDelete open={!!deleteTarget} title="Service" onConfirm={confirmDelete} onCancel={() => { setDeleteTarget(null); setDeleting(false) }} deleting={deleting} />
    </motion.div>
  )
}

/* ─── PORTFOLIO TAB ─── */
function PortfolioTab() {
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [lang, setLang] = useState<Lang>("ID")
  const [form, setForm] = useState({ title_id: "", title_en: "", category: "Website" as string, description_id: "", description_en: "", image_url: "", tech_stack: "", project_url: "" })
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [catSaving, setCatSaving] = useState(false)

  function toCatItems(raw: string): CategoryItem[] {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) return CATEGORIES.map((c) => ({ name: c, visible: true }))
        if (typeof parsed[0] === "string") return parsed.map((c) => ({ name: c, visible: true }))
        return parsed as CategoryItem[]
      }
    } catch {}
    return CATEGORIES.map((c) => ({ name: c, visible: true }))
  }

  function catNames() { return categories.map((c) => c.name) }

  async function saveCategories(list: CategoryItem[]) {
    setCatSaving(true)
    const res = await updateSettings([{ key: "portfolio_categories", value: JSON.stringify(list) }])
    if (res.success) { setCategories(list); toast.success("Categories saved") }
    else toast.error(res.error)
    setCatSaving(false)
  }

  async function toggleVisibility(name: string) {
    await saveCategories(categories.map((c) => c.name === name ? { ...c, visible: !c.visible } : c))
  }

  async function addCategory() {
    const trimmed = newCategory.trim()
    if (!trimmed) return
    if (catNames().includes(trimmed)) { toast.error("Category already exists"); return }
    await saveCategories([...categories, { name: trimmed, visible: true }])
    setNewCategory("")
  }

  async function removeCategory(cat: string) {
    await saveCategories(categories.filter((c) => c.name !== cat))
  }

  async function fetchData() {
    setLoading(true)
    const [projRes, catRes] = await Promise.all([getProjects(), getSettings()])
    if (projRes.success) setProjects(projRes.data)
    else toast.error(projRes.error)
    if (catRes.success) {
      const raw = catRes.data.find((s) => s.key === "portfolio_categories")?.value
      setCategories(raw ? toCatItems(raw) : CATEGORIES.map((c) => ({ name: c, visible: true })))
    } else {
      setCategories(CATEGORIES.map((c) => ({ name: c, visible: true })))
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function resetForm() { setForm({ title_id: "", title_en: "", category: catNames()[0] || "Website", description_id: "", description_en: "", image_url: "", tech_stack: "", project_url: "" }); setEditId(null) }

  async function handleSave() {
    if (!form.title_id || !form.title_en) { toast.error("Title required in both languages"); return }
    setSaving(true)
    const input = { ...form, image_url: form.image_url || undefined, tech_stack: form.tech_stack || undefined, project_url: form.project_url || undefined }
    const res = editId ? await updateProject(editId, input) : await createProject(input)
    setSaving(false)
    if (res.success) { toast.success(editId ? "Updated" : "Created"); resetForm(); fetchData() }
    else toast.error(res.error)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await deleteProject(deleteTarget)
    setDeleting(false)
    if (res.success) { toast.success("Deleted"); setDeleteTarget(null); fetchData() }
    else toast.error(res.error)
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-white/40"><Loader2 className="h-5 w-5 animate-spin" /></div>

  const currentDesc = lang === "ID" ? form.description_id : form.description_en
  const setDesc = (v: string) => setForm({ ...form, [lang === "ID" ? "description_id" : "description_en"]: v })

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Portfolio</h2>
        <LangToggle lang={lang} setLang={setLang} />
      </div>

      <div className="mb-6 space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input value={form.title_id} onChange={(e) => setForm({ ...form, title_id: e.target.value })} placeholder="Title (ID)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
          <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} placeholder="Title (EN)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <Field label="Description" value={currentDesc} onChange={setDesc} textarea />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 [&>option]:bg-background [&>option]:text-white"
            >
              {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <span key={c.name} className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", c.visible ? "bg-primary/15 text-primary" : "bg-white/5 text-white/40 line-through")}>
                  <button type="button" onClick={() => toggleVisibility(c.name)} className="hover:text-foreground" title={c.visible ? "Hide from user" : "Show to user"}>
                    {c.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </button>
                  {c.name}
                  <button type="button" onClick={() => removeCategory(c.name)} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button type="button" onClick={() => (document.getElementById('cat-input') as HTMLInputElement)?.focus()} className="rounded-full border border-dashed border-white/20 px-2.5 py-0.5 text-xs text-white/40 hover:border-white/40 hover:text-white/70">+</button>
            </div>
            <div className="mt-2 flex gap-2">
              <input
                id="cat-input"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
                placeholder="New category..."
                className="h-8 flex-1 rounded-lg border border-white/10 bg-white/5 px-2.5 text-xs text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
              />
              <button type="button" onClick={addCategory} disabled={catSaving || !newCategory.trim()} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50">
                {catSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                Add
              </button>
            </div>
          </div>
          <Field label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
          <Field label="Tech Stack (optional)" value={form.tech_stack} onChange={(v) => setForm({ ...form, tech_stack: v })} />
        </div>
        <Field label="Project/Demo URL (optional)" value={form.project_url} onChange={(v) => setForm({ ...form, project_url: v })} />
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? "Update" : "Add"} Project
          </button>
          {editId && <button onClick={resetForm} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5">Cancel</button>}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/8 text-xs uppercase tracking-wider text-white/50">
            <tr>
              <th className="px-3 py-2">Preview</th>
              <th className="px-3 py-2">Title (ID)</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Tech Stack</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                <td className="px-3 py-3">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title_id} className="h-10 w-14 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-white/5 text-white/30"><Image className="h-4 w-4" /></div>
                  )}
                </td>
                <td className="px-3 py-3 font-medium">{p.title_id}</td>
                <td className="px-3 py-3"><span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">{p.category}</span></td>
                <td className="px-3 py-3 text-xs text-white/50">{p.tech_stack || "—"}</td>
                <td className="px-3 py-3 text-right">
                  <button onClick={() => { setEditId(p.id); setForm({ title_id: p.title_id, title_en: p.title_en, category: p.category, description_id: p.description_id, description_en: p.description_en, image_url: p.image_url || "", tech_stack: p.tech_stack || "", project_url: p.project_url || "" }) }} className="mr-1 grid h-7 w-7 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                  <AnimatedDeleteButton size="sm" onClick={() => setDeleteTarget(p.id)} />
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-8 text-center text-white/30">No projects yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDelete open={!!deleteTarget} title="Project" onConfirm={confirmDelete} onCancel={() => { setDeleteTarget(null); setDeleting(false) }} deleting={deleting} />
    </motion.div>
  )
}

/* ─── CONTACT TAB ─── */
function ContactTab() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings().then((res) => {
      if (res.success) {
        const map: Record<string, string> = {}
        res.data.forEach((s) => { map[s.key] = s.value })
        setSettings(map)
      } else toast.error(res.error)
      setLoading(false)
    })
  }, [])

  const set = (key: string) => (val: string) => setSettings((s) => ({ ...s, [key]: val }))

  async function handleSave() {
    setSaving(true)
    const keys = ["contact_whatsapp", "contact_email", "contact_instagram"]
    const updates = keys.map((k) => ({ key: k, value: settings[k] || "" }))
    const res = await updateSettings(updates)
    setSaving(false)
    if (res.success) toast.success("Contact info saved")
    else toast.error(res.error)
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-white/40"><Loader2 className="h-5 w-5 animate-spin" /></div>

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass space-y-5 rounded-2xl p-6">
      <h2 className="text-lg font-bold">Contact & Footer</h2>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <Field label="WhatsApp Number" value={settings.contact_whatsapp || ""} onChange={set("contact_whatsapp")} />
        <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
          <ExternalLink className="h-3 w-3" />
          Used for WhatsApp buttons across the site
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <Field label="Email Address" value={settings.contact_email || ""} onChange={set("contact_email")} />
        <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
          <Mail className="h-3 w-3" />
          Used for email links and footer
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <Field label="Instagram Username" value={settings.contact_instagram || ""} onChange={set("contact_instagram")} />
        <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
          <Instagram className="h-3 w-3" />
          Username only (without @), used for Instagram links
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>
    </motion.div>
  )
}
