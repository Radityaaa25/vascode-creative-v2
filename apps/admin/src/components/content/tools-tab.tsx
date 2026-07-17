'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import AnimatedDeleteButton from "@/components/ui/animated-delete-button"
import AnimatedEditButton from "@/components/ui/animated-edit-button"
import { getTools, createTool, updateTool, deleteTool, type ToolRow, getSettings, updateSettings } from "@/app/actions/content"
import { ConfirmDelete } from "@/components/content/shared"

export default function ToolsTab({ onDirtyChange }: { onDirtyChange?: (v: boolean) => void }) {
  const [tools, setTools] = useState<ToolRow[]>([])
  
  // Settings state
  const [settingsForm, setSettingsForm] = useState({
    tools_subtitle_id: "", tools_subtitle_en: "",
    tools_title_id: "", tools_title_en: ""
  })
  const [savingSettings, setSavingSettings] = useState(false)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", logo_url: "" })
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function fetchData() {
    setLoading(true)
    const [res, settingsRes] = await Promise.all([getTools(), getSettings()])
    if (res.success) setTools(res.data)
    else toast.error(res.error)
    
    if (settingsRes.success) {
      const s = settingsRes.data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {} as Record<string, string>)
      setSettingsForm({
        tools_subtitle_id: s.tools_subtitle_id || "",
        tools_subtitle_en: s.tools_subtitle_en || "",
        tools_title_id: s.tools_title_id || "",
        tools_title_en: s.tools_title_en || ""
      })
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  async function handleSaveSettings() {
    setSavingSettings(true)
    const payload = Object.entries(settingsForm).map(([key, value]) => ({ key, value }))
    const res = await updateSettings(payload)
    setSavingSettings(false)
    if (res.success) {
      toast.success("Settings saved")
      onDirtyChange?.(false)
    } else {
      toast.error(res.error)
    }
  }

  function handleSettingsChange(k: keyof typeof settingsForm, v: string) {
    setSettingsForm(prev => ({ ...prev, [k]: v }))
    onDirtyChange?.(true)
  }

  function resetForm() { setForm({ name: "", logo_url: "" }); setEditId(null) }

  async function handleSave() {
    if (!form.name || !form.logo_url) { toast.error("Name and Logo URL required"); return }
    setSaving(true)
    const res = editId ? await updateTool(editId, form) : await createTool(form)
    setSaving(false)
    if (res.success) { toast.success(editId ? "Updated" : "Created"); resetForm(); fetchData() }
    else toast.error(res.error)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await deleteTool(deleteTarget)
    setDeleting(false)
    if (res.success) { toast.success("Deleted"); setDeleteTarget(null); fetchData() }
    else toast.error(res.error)
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-white/40"><Loader2 className="h-5 w-5 animate-spin" /></div>

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-bold">Tools Section Settings</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/60">Indonesian</h3>
            <div className="space-y-2">
              <label className="text-xs text-white/40">Subtitle (Badge)</label>
              <input value={settingsForm.tools_subtitle_id} onChange={(e) => handleSettingsChange("tools_subtitle_id", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" placeholder="TOOLS" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/40">Title (gunakan &lt;br&gt; untuk baris baru)</label>
              <textarea value={settingsForm.tools_title_id} onChange={(e) => handleSettingsChange("tools_title_id", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary/50 focus:outline-none min-h-[80px]" placeholder="Alat andalan para ahli kreatif." />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/60">English</h3>
            <div className="space-y-2">
              <label className="text-xs text-white/40">Subtitle (Badge)</label>
              <input value={settingsForm.tools_subtitle_en} onChange={(e) => handleSettingsChange("tools_subtitle_en", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary/50 focus:outline-none" placeholder="TOOLS" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/40">Title (use &lt;br&gt; for new line)</label>
              <textarea value={settingsForm.tools_title_en} onChange={(e) => handleSettingsChange("tools_title_en", e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary/50 focus:outline-none min-h-[80px]" placeholder="Trusted by experts. Used by the leaders." />
            </div>
          </div>
        </div>
        <button onClick={handleSaveSettings} disabled={savingSettings} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
          {savingSettings && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Texts
        </button>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-bold">Tools Logos</h2>

        <div className="mb-6 space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tool Name (e.g. Canva)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
            <input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} placeholder="Logo URL (SVG/PNG)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? "Update" : "Add"} Tool
            </button>
            {editId && <button onClick={resetForm} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5">Cancel</button>}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/8 text-xs uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-3 py-2 w-8">#</th>
                <th className="px-3 py-2 w-16">Logo</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((t, i) => (
                <tr key={t.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                  <td className="px-3 py-3 text-white/40">{i + 1}</td>
                  <td className="px-3 py-3">
                    <img src={t.logo_url} alt={t.name} className="h-8 w-8 object-contain rounded-md bg-white/10 p-1" />
                  </td>
                  <td className="px-3 py-3 font-medium max-w-xs truncate">{t.name}</td>
                  <td className="px-3 py-3 text-right">
                    <AnimatedEditButton size="sm" onClick={() => { setEditId(t.id); setForm({ name: t.name, logo_url: t.logo_url }) }} />
                    <AnimatedDeleteButton size="sm" onClick={() => setDeleteTarget(t.id)} />
                  </td>
                </tr>
              ))}
              {tools.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-8 text-center text-white/30">No tools yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDelete open={!!deleteTarget} title="Tool" onConfirm={confirmDelete} onCancel={() => { setDeleteTarget(null); setDeleting(false) }} deleting={deleting} />
    </motion.div>
  )
}
