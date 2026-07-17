'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Loader2, Save, Plus, X, Image, Eye, EyeOff } from "lucide-react"
import AnimatedDeleteButton from "@/components/ui/animated-delete-button"
import AnimatedEditButton from "@/components/ui/animated-edit-button"
import { getProjects, createProject, updateProject, deleteProject, getSettings, updateSettings, type ProjectRow } from "@/app/actions/content"
import { ConfirmDelete, Field, LangToggle, ICON_MAP, CATEGORIES, type Lang } from "@/components/content/shared"

type CategoryItem = { name: string; visible: boolean }

export default function PortfolioTab({ onDirtyChange }: { onDirtyChange?: (v: boolean) => void }) {
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [lang, setLang] = useState<Lang>("ID")
  const [form, setForm] = useState({ title_id: "", title_en: "", category: "Website" as string, description_id: "", description_en: "", image_url: "", tech_stack: "", project_url: "", links: [] as { label: string; url: string }[] })
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [catSaving, setCatSaving] = useState(false)
  const [sectionSettings, setSectionSettings] = useState<Record<string, string>>({})
  const [sectionSaving, setSectionSaving] = useState(false)

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
      const map: Record<string, string> = {}
      catRes.data.forEach((s: any) => { map[s.key] = s.value })
      setSectionSettings(map)
      const raw = map["portfolio_categories"]
      setCategories(raw ? toCatItems(raw) : CATEGORIES.map((c) => ({ name: c, visible: true })))
    } else {
      setCategories(CATEGORIES.map((c) => ({ name: c, visible: true })))
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function resetForm() { setForm({ title_id: "", title_en: "", category: catNames()[0] || "Website", description_id: "", description_en: "", image_url: "", tech_stack: "", project_url: "", links: [] }); setEditId(null) }

  async function handleSave() {
    if (!form.title_id || !form.title_en) { toast.error("Title required in both languages"); return }
    setSaving(true)
    const input = { ...form, image_url: form.image_url || undefined, tech_stack: form.tech_stack || undefined, project_url: form.project_url || undefined, links: form.links.length > 0 ? form.links : undefined }
    const res = editId ? await updateProject(editId, input) : await createProject(input)
    setSaving(false)
    if (res.success) { toast.success(editId ? "Updated" : "Created"); resetForm(); fetchData(); onDirtyChange?.(false) }
    else toast.error(res.error)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await deleteProject(deleteTarget)
    setDeleting(false)
    if (res.success) { toast.success("Deleted"); setDeleteTarget(null); fetchData(); onDirtyChange?.(false) }
    else toast.error(res.error)
  }

  function markDirty() { onDirtyChange?.(true) }

  async function handleSectionSave() {
    setSectionSaving(true)
    const keys = ["portfolio_title_id", "portfolio_title_en", "portfolio_subtitle_id", "portfolio_subtitle_en", "portfolio_desc_id", "portfolio_desc_en"]
    const updates = keys.map((k) => ({ key: k, value: sectionSettings[k] || "" }))
    const res = await updateSettings(updates)
    setSectionSaving(false)
    if (res.success) { toast.success("Section texts saved"); onDirtyChange?.(false) }
    else toast.error(res.error)
  }
  const setSection = (key: string) => (val: string) => {
    setSectionSettings((s) => ({ ...s, [key]: val }))
    onDirtyChange?.(true)
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-white/40"><Loader2 className="h-5 w-5 animate-spin" /></div>

  const currentDesc = lang === "ID" ? form.description_id : form.description_en
  const setDesc = (v: string) => { setForm({ ...form, [lang === "ID" ? "description_id" : "description_en"]: v }); markDirty() }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="glass space-y-5 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Portfolio — Section Texts</h2>
          <LangToggle lang={lang} setLang={setLang} />
        </div>
        <Field label="Title" value={sectionSettings[`portfolio_title_${lang.toLowerCase()}`] || ""} onChange={setSection(`portfolio_title_${lang.toLowerCase()}`)} />
        <Field label="Subtitle (Badge)" value={sectionSettings[`portfolio_subtitle_${lang.toLowerCase()}`] || ""} onChange={setSection(`portfolio_subtitle_${lang.toLowerCase()}`)} />
        <Field label="Description" value={sectionSettings[`portfolio_desc_${lang.toLowerCase()}`] || ""} onChange={setSection(`portfolio_desc_${lang.toLowerCase()}`)} textarea />
        <button onClick={handleSectionSave} disabled={sectionSaving} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
          {sectionSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Section Texts
        </button>
      </div>

      <div className="glass rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Portfolio — Items</h2>
        <LangToggle lang={lang} setLang={setLang} />
      </div>

      <div className="mb-6 space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input value={form.title_id} onChange={(e) => { setForm({ ...form, title_id: e.target.value }); markDirty() }} placeholder="Title (ID)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
          <input value={form.title_en} onChange={(e) => { setForm({ ...form, title_en: e.target.value }); markDirty() }} placeholder="Title (EN)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
        </div>
        <Field label="Description" value={currentDesc} onChange={setDesc} textarea />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">Category</label>
            <select
              value={form.category}
              onChange={(e) => { setForm({ ...form, category: e.target.value }); markDirty() }}
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 [&>option]:bg-background [&>option]:text-white"
            >
              {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <span key={c.name} className={"inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium " + (c.visible ? "bg-primary/15 text-primary" : "bg-white/5 text-white/40 line-through")}>
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
          <Field label="Image URL" value={form.image_url} onChange={(v) => { setForm({ ...form, image_url: v }); markDirty() }} />
          <Field label="Tech Stack (optional)" value={form.tech_stack} onChange={(v) => { setForm({ ...form, tech_stack: v }); markDirty() }} />
        </div>
        <div className="space-y-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">Links</label>
          {form.links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input value={link.label} onChange={(e) => { const l = [...form.links]; l[i] = { ...l[i], label: e.target.value }; setForm({ ...form, links: l }); markDirty() }} placeholder="Label (e.g. Demo, GitHub)" className="h-10 w-1/3 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
              <input value={link.url} onChange={(e) => { const l = [...form.links]; l[i] = { ...l[i], url: e.target.value }; setForm({ ...form, links: l }); markDirty() }} placeholder="URL" className="h-10 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
              <button type="button" onClick={() => { setForm({ ...form, links: form.links.filter((_, j) => j !== i) }); markDirty() }} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white/40 hover:border-destructive hover:text-destructive"><X className="h-4 w-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => { setForm({ ...form, links: [...form.links, { label: "", url: "" }] }); markDirty() }} className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-white/20 px-4 py-2 text-xs font-medium text-white/40 transition hover:border-white/40 hover:text-white/70">
            <Plus className="h-3.5 w-3.5" /> Add Link
          </button>
        </div>
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
                  <AnimatedEditButton size="sm" onClick={() => { setEditId(p.id); setForm({ title_id: p.title_id, title_en: p.title_en, category: p.category, description_id: p.description_id, description_en: p.description_en, image_url: p.image_url || "", tech_stack: p.tech_stack || "", project_url: p.project_url || "", links: p.links || [] }) }} />
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
      </div>
    </motion.div>
  )
}
