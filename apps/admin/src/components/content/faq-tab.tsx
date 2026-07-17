'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Plus, Save, Loader2 } from "lucide-react"
import AnimatedDeleteButton from "@/components/ui/animated-delete-button"
import AnimatedEditButton from "@/components/ui/animated-edit-button"
import { getFAQ, createFAQ, updateFAQ, deleteFAQ, getSettings, updateSettings, type FaqRow } from "@/app/actions/content"
import { ConfirmDelete } from "@/components/content/shared"

export default function FaqTab({ onDirtyChange }: { onDirtyChange?: (v: boolean) => void }) {
  const [faqs, setFaqs] = useState<FaqRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ question_id: "", question_en: "", answer_id: "", answer_en: "" })
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [settingsSaving, setSettingsSaving] = useState(false)

  async function fetchData() {
    setLoading(true)
    const [faqRes, settingsRes] = await Promise.all([getFAQ(), getSettings()])
    if (faqRes.success) setFaqs(faqRes.data)
    else toast.error(faqRes.error)
    if (settingsRes.success) {
      const map: Record<string, string> = {}
      settingsRes.data.forEach((s: any) => { map[s.key] = s.value })
      setSettings(map)
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function resetForm() { setForm({ question_id: "", question_en: "", answer_id: "", answer_en: "" }); setEditId(null) }

  async function handleSave() {
    if (!form.question_id || !form.answer_id) { toast.error("Question and answer required in ID"); return }
    setSaving(true)
    const res = editId ? await updateFAQ(editId, form) : await createFAQ(form)
    setSaving(false)
    if (res.success) { toast.success(editId ? "Updated" : "Created"); resetForm(); fetchData() }
    else toast.error(res.error)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await deleteFAQ(deleteTarget)
    setDeleting(false)
    if (res.success) { toast.success("Deleted"); setDeleteTarget(null); fetchData() }
    else toast.error(res.error)
  }

  async function handleSettingsSave() {
    setSettingsSaving(true)
    const keys = ["faq_title_id", "faq_title_en"]
    const updates = keys.map((k) => ({ key: k, value: settings[k] || "" }))
    const res = await updateSettings(updates)
    setSettingsSaving(false)
    if (res.success) toast.success("Header saved")
    else toast.error(res.error)
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-white/40"><Loader2 className="h-5 w-5 animate-spin" /></div>

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="glass space-y-5 rounded-2xl p-6">
        <h2 className="text-lg font-bold">Section Header</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">Title (ID)</label>
            <input value={settings.faq_title_id || ""} onChange={(e) => setSettings({ ...settings, faq_title_id: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">Title (EN)</label>
            <input value={settings.faq_title_en || ""} onChange={(e) => setSettings({ ...settings, faq_title_en: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <button onClick={handleSettingsSave} disabled={settingsSaving} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110 disabled:opacity-60">
          {settingsSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Header
        </button>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-bold">FAQ Items</h2>

        <div className="mb-6 space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input value={form.question_id} onChange={(e) => setForm({ ...form, question_id: e.target.value })} placeholder="Question (ID)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
            <input value={form.question_en} onChange={(e) => setForm({ ...form, question_en: e.target.value })} placeholder="Question (EN)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
          </div>
          <textarea value={form.answer_id} onChange={(e) => setForm({ ...form, answer_id: e.target.value })} placeholder="Answer (ID)" rows={3} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
          <textarea value={form.answer_en} onChange={(e) => setForm({ ...form, answer_en: e.target.value })} placeholder="Answer (EN)" rows={3} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? "Update" : "Add"} FAQ
            </button>
            {editId && <button onClick={resetForm} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5">Cancel</button>}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/8 text-xs uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-3 py-2 w-8">#</th>
                <th className="px-3 py-2">Question (ID)</th>
                <th className="px-3 py-2">Question (EN)</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((f, i) => (
                <tr key={f.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                  <td className="px-3 py-3 text-white/40">{i + 1}</td>
                  <td className="px-3 py-3 font-medium max-w-xs truncate">{f.question_id}</td>
                  <td className="px-3 py-3 text-white/70 max-w-xs truncate">{f.question_en}</td>
                  <td className="px-3 py-3 text-right">
                    <AnimatedEditButton size="sm" onClick={() => { setEditId(f.id); setForm({ question_id: f.question_id, question_en: f.question_en, answer_id: f.answer_id, answer_en: f.answer_en }) }} />
                    <AnimatedDeleteButton size="sm" onClick={() => setDeleteTarget(f.id)} />
                  </td>
                </tr>
              ))}
              {faqs.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-8 text-center text-white/30">No FAQ yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDelete open={!!deleteTarget} title="FAQ" onConfirm={confirmDelete} onCancel={() => { setDeleteTarget(null); setDeleting(false) }} deleting={deleting} />
    </motion.div>
  )
}
