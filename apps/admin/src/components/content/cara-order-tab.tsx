'use client'

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Plus, Save, Loader2 } from "lucide-react"
import AnimatedDeleteButton from "@/components/ui/animated-delete-button"
import AnimatedEditButton from "@/components/ui/animated-edit-button"
import { getHowToOrderSteps, createHowToOrderStep, updateHowToOrderStep, deleteHowToOrderStep, getSettings, updateSettings, type HowToOrderRow } from "@/app/actions/content"
import { ConfirmDelete, ICON_MAP } from "@/components/content/shared"

const ICON_OPTIONS = [
  "Globe", "Video", "Camera", "Palette", "Film", "Monitor", "Smartphone",
  "PenTool", "Image", "Music", "Code", "Layout", "Megaphone", "BookOpen",
  "ShoppingBag", "Users", "MessageCircle", "ArrowRight", "ExternalLink",
  "FileText", "MessageSquare", "CreditCard", "Settings", "CheckCircle2", "Sparkles", "Eye",
] as const

export default function CaraOrderTab({ onDirtyChange }: { onDirtyChange?: (v: boolean) => void }) {
  const [steps, setSteps] = useState<HowToOrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ title_id: "", title_en: "", description_id: "", description_en: "", icon: "ArrowRight", step_number: 0 })
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [settingsSaving, setSettingsSaving] = useState(false)

  async function fetchData() {
    setLoading(true)
    const [stepsRes, settingsRes] = await Promise.all([getHowToOrderSteps(), getSettings()])
    if (stepsRes.success) setSteps(stepsRes.data)
    else toast.error(stepsRes.error)
    if (settingsRes.success) {
      const map: Record<string, string> = {}
      settingsRes.data.forEach((s: any) => { map[s.key] = s.value })
      setSettings(map)
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function resetForm() {
    setForm({ title_id: "", title_en: "", description_id: "", description_en: "", icon: "ArrowRight", step_number: steps.length + 1 })
    setEditId(null)
  }

  async function handleSave() {
    if (!form.title_id || !form.title_en) { toast.error("Title required in both languages"); return }
    setSaving(true)
    const input = { ...form, step_number: form.step_number || steps.length + 1 }
    const res = editId ? await updateHowToOrderStep(editId, input) : await createHowToOrderStep(input)
    setSaving(false)
    if (res.success) { toast.success(editId ? "Updated" : "Created"); resetForm(); fetchData() }
    else toast.error(res.error)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await deleteHowToOrderStep(deleteTarget)
    setDeleting(false)
    if (res.success) { toast.success("Deleted"); setDeleteTarget(null); fetchData() }
    else toast.error(res.error)
  }

  async function handleSettingsSave() {
    setSettingsSaving(true)
    const keys = ["howtoorder_title_id", "howtoorder_title_en"]
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
            <input value={settings.howtoorder_title_id || ""} onChange={(e) => setSettings({ ...settings, howtoorder_title_id: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">Title (EN)</label>
            <input value={settings.howtoorder_title_en || ""} onChange={(e) => setSettings({ ...settings, howtoorder_title_en: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <button onClick={handleSettingsSave} disabled={settingsSaving} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110 disabled:opacity-60">
          {settingsSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Header
        </button>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-bold">Steps</h2>

        <div className="mb-6 space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input value={form.title_id} onChange={(e) => setForm({ ...form, title_id: e.target.value })} placeholder="Title (ID)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
            <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} placeholder="Title (EN)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
            <div className="flex gap-2">
              <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="h-10 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:border-primary/50 focus:outline-none [&>option]:bg-background [&>option]:text-white">
                {ICON_OPTIONS.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
              <input type="number" value={form.step_number || ""} onChange={(e) => setForm({ ...form, step_number: parseInt(e.target.value) || 0 })} placeholder="#" className="h-10 w-16 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
            </div>
          </div>
          <textarea value={form.description_id} onChange={(e) => setForm({ ...form, description_id: e.target.value })} placeholder="Description (ID)" rows={2} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
          <textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} placeholder="Description (EN)" rows={2} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? "Update" : "Add"} Step
            </button>
            {editId && <button onClick={resetForm} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5">Cancel</button>}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/8 text-xs uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Icon</th>
                <th className="px-3 py-2">Title (ID)</th>
                <th className="px-3 py-2">Title (EN)</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {steps.sort((a, b) => a.step_number - b.step_number).map((s) => (
                <tr key={s.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                  <td className="px-3 py-3 text-white/40">{s.step_number}</td>
                  <td className="px-3 py-3">{ICON_MAP[s.icon] ? React.createElement(ICON_MAP[s.icon]!, { className: "h-4 w-4 text-primary" }) : <span className="text-white/30">{s.icon}</span>}</td>
                  <td className="px-3 py-3 font-medium">{s.title_id}</td>
                  <td className="px-3 py-3 text-white/70">{s.title_en}</td>
                  <td className="px-3 py-3 text-right">
                    <AnimatedEditButton size="sm" onClick={() => { setEditId(s.id); setForm({ title_id: s.title_id, title_en: s.title_en, description_id: s.description_id, description_en: s.description_en, icon: s.icon, step_number: s.step_number }) }} />
                    <AnimatedDeleteButton size="sm" onClick={() => setDeleteTarget(s.id)} />
                  </td>
                </tr>
              ))}
              {steps.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-white/30">No steps yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDelete open={!!deleteTarget} title="Step" onConfirm={confirmDelete} onCancel={() => { setDeleteTarget(null); setDeleting(false) }} deleting={deleting} />
    </motion.div>
  )
}
