'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"
import AnimatedDeleteButton from "@/components/ui/animated-delete-button"
import AnimatedEditButton from "@/components/ui/animated-edit-button"
import { getServices, createService, updateService, deleteService, getSettings, updateSettings, type ServiceRow } from "@/app/actions/content"
import { ConfirmDelete, Field, IconPicker, LangToggle, ICON_MAP, type Lang } from "@/components/content/shared"

export default function ServicesTab({ onDirtyChange }: { onDirtyChange?: (v: boolean) => void }) {
  const [services, setServices] = useState<ServiceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [lang, setLang] = useState<Lang>("ID")
  const [form, setForm] = useState({ title_id: "", title_en: "", icon: "Globe", description_id: "", description_en: "", wa_template_id: "", wa_template_en: "" })
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [sectionSettings, setSectionSettings] = useState<Record<string, string>>({})
  const [sectionSaving, setSectionSaving] = useState(false)

  async function fetchData() {
    setLoading(true)
    const [svcRes, settingsRes] = await Promise.all([getServices(), getSettings()])
    if (svcRes.success) setServices(svcRes.data)
    else toast.error(svcRes.error)
    if (settingsRes.success) {
      const map: Record<string, string> = {}
      settingsRes.data.forEach((s: any) => { map[s.key] = s.value })
      setSectionSettings(map)
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  async function handleSectionSave() {
    setSectionSaving(true)
    const keys = ["services_title_id", "services_title_en", "services_subtitle_id", "services_subtitle_en", "services_desc_id", "services_desc_en", "cta_book_id", "cta_book_en"]
    const updates = keys.map((k) => ({ key: k, value: sectionSettings[k] || "" }))
    const res = await updateSettings(updates)
    setSectionSaving(false)
    if (res.success) { toast.success("Section texts saved"); onDirtyChange?.(false) }
    else toast.error(res.error)
  }

  function resetForm() { setForm({ title_id: "", title_en: "", icon: "Globe", description_id: "", description_en: "", wa_template_id: "", wa_template_en: "" }); setEditId(null) }

  async function handleSave() {
    if (!form.title_id || !form.title_en) { toast.error("Title required in both languages"); return }
    setSaving(true)
    const res = editId ? await updateService(editId, form) : await createService(form)
    setSaving(false)
    if (res.success) { toast.success(editId ? "Updated" : "Created"); resetForm(); fetchData(); onDirtyChange?.(false) }
    else toast.error(res.error)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await deleteService(deleteTarget)
    setDeleting(false)
    if (res.success) { toast.success("Deleted"); setDeleteTarget(null); fetchData(); onDirtyChange?.(false) }
    else toast.error(res.error)
  }

  function markDirty() { onDirtyChange?.(true) }

  if (loading) return <div className="flex items-center justify-center py-20 text-white/40"><Loader2 className="h-5 w-5 animate-spin" /></div>

  const currentDesc = lang === "ID" ? form.description_id : form.description_en
  const currentWa = lang === "ID" ? form.wa_template_id : form.wa_template_en
  const setDesc = (v: string) => { setForm({ ...form, [lang === "ID" ? "description_id" : "description_en"]: v }); markDirty() }
  const setWa = (v: string) => { setForm({ ...form, [lang === "ID" ? "wa_template_id" : "wa_template_en"]: v }); markDirty() }

  const setSection = (key: string) => (val: string) => {
    setSectionSettings((s) => ({ ...s, [key]: val }))
    onDirtyChange?.(true)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="glass space-y-5 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Services — Section Texts</h2>
          <LangToggle lang={lang} setLang={setLang} />
        </div>
        <Field label="Title" value={sectionSettings[`services_title_${lang.toLowerCase()}`] || ""} onChange={setSection(`services_title_${lang.toLowerCase()}`)} />
        <Field label="Subtitle (Badge)" value={sectionSettings[`services_subtitle_${lang.toLowerCase()}`] || ""} onChange={setSection(`services_subtitle_${lang.toLowerCase()}`)} />
        <Field label="Description" value={sectionSettings[`services_desc_${lang.toLowerCase()}`] || ""} onChange={setSection(`services_desc_${lang.toLowerCase()}`)} textarea />
        <Field label="CTA Button Text" value={sectionSettings[`cta_book_${lang.toLowerCase()}`] || ""} onChange={setSection(`cta_book_${lang.toLowerCase()}`)} />
        <button onClick={handleSectionSave} disabled={sectionSaving} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
          {sectionSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Section Texts
        </button>
      </div>

      <div className="glass rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Services — Items</h2>
        <LangToggle lang={lang} setLang={setLang} />
      </div>

      <div className="mb-6 space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input value={form.title_id} onChange={(e) => { setForm({ ...form, title_id: e.target.value }); markDirty() }} placeholder="Title (ID)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
          <input value={form.title_en} onChange={(e) => { setForm({ ...form, title_en: e.target.value }); markDirty() }} placeholder="Title (EN)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
        </div>
        <IconPicker value={form.icon} onChange={(v) => { setForm({ ...form, icon: v }); markDirty() }} />
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
                    <AnimatedEditButton size="sm" onClick={() => { setEditId(s.id); setForm({ title_id: s.title_id, title_en: s.title_en, icon: s.icon, description_id: s.description_id, description_en: s.description_en, wa_template_id: s.wa_template_id, wa_template_en: s.wa_template_en }) }} />
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
      </div>
    </motion.div>
  )
}
