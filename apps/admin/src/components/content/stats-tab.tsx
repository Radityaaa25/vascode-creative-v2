'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import AnimatedDeleteButton from "@/components/ui/animated-delete-button"
import AnimatedEditButton from "@/components/ui/animated-edit-button"
import { getStats, createStat, updateStat, deleteStat, type StatRow } from "@/app/actions/content"
import { ConfirmDelete } from "@/components/content/shared"

export default function StatsTab({ onDirtyChange }: { onDirtyChange?: (v: boolean) => void }) {
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
    if (res.success) { toast.success(editId ? "Updated" : "Created"); resetForm(); fetchData(); onDirtyChange?.(false) }
    else toast.error(res.error)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await deleteStat(deleteTarget)
    setDeleting(false)
    if (res.success) { toast.success("Deleted"); setDeleteTarget(null); fetchData(); onDirtyChange?.(false) }
    else toast.error(res.error)
  }

  function updateForm(k: keyof typeof form, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }))
    onDirtyChange?.(true)
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-white/40"><Loader2 className="h-5 w-5 animate-spin" /></div>

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <h2 className="mb-4 text-lg font-bold">About Stats</h2>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
        <input value={form.label_id} onChange={(e) => updateForm('label_id', e.target.value)} placeholder="Label (ID)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
        <input value={form.label_en} onChange={(e) => updateForm('label_en', e.target.value)} placeholder="Label (EN)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
        <input value={form.value} onChange={(e) => updateForm('value', e.target.value)} placeholder="Value (e.g. 50+)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" />
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
                  <AnimatedEditButton size="sm" onClick={() => { setEditId(s.id); setForm({ label_id: s.label_id, label_en: s.label_en, value: s.value }) }} />
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
