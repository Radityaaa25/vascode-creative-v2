'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Plus, Save, Loader2 } from "lucide-react"
import AnimatedDeleteButton from "@/components/ui/animated-delete-button"
import AnimatedEditButton from "@/components/ui/animated-edit-button"
import { getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink, type SocialLinkRow } from "@/app/actions/content"
import { ConfirmDelete, ICON_MAP } from "@/components/content/shared"

const ICON_OPTIONS = [
  "Globe", "Video", "Camera", "Palette", "Film", "Monitor", "Smartphone",
  "PenTool", "Image", "Music", "Code", "Layout", "Megaphone", "BookOpen",
  "ShoppingBag", "Users", "MessageCircle", "Mail", "Instagram", "MessageSquare",
] as const

export default function FooterTab({ onDirtyChange }: { onDirtyChange?: (v: boolean) => void }) {
  const [links, setLinks] = useState<SocialLinkRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ platform: "", icon: "Globe", url: "", label_id: "", label_en: "", is_active: true })
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function fetchData() {
    setLoading(true)
    const res = await getSocialLinks()
    if (res.success) setLinks(res.data)
    else toast.error(res.error)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function resetForm() { setForm({ platform: "", icon: "Globe", url: "", label_id: "", label_en: "", is_active: true }); setEditId(null) }

  async function handleSave() {
    if (!form.platform || !form.url) { toast.error("Platform and URL required"); return }
    setSaving(true)
    const res = editId ? await updateSocialLink(editId, form) : await createSocialLink(form)
    setSaving(false)
    if (res.success) { toast.success(editId ? "Updated" : "Created"); resetForm(); fetchData() }
    else toast.error(res.error)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await deleteSocialLink(deleteTarget)
    setDeleting(false)
    if (res.success) { toast.success("Deleted"); setDeleteTarget(null); fetchData() }
    else toast.error(res.error)
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-white/40"><Loader2 className="h-5 w-5 animate-spin" /></div>

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <h2 className="mb-4 text-lg font-bold">Social Links</h2>

      <div className="mb-6 space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} placeholder="Platform name (e.g. YouTube)" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
          <div>
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:border-primary/50 focus:outline-none [&>option]:bg-background [&>option]:text-white">
              {ICON_OPTIONS.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
        </div>
        <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="Full URL (e.g. https://youtube.com/@...)" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input value={form.label_id} onChange={(e) => setForm({ ...form, label_id: e.target.value })} placeholder="Label (ID) e.g. Ikuti YouTube Kami" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
          <input value={form.label_en} onChange={(e) => setForm({ ...form, label_en: e.target.value })} placeholder="Label (EN) e.g. Follow Our YouTube" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-white/10 bg-white/5" />
          <span className="text-sm text-white/70">Active</span>
        </label>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? "Update" : "Add"} Link
          </button>
          {editId && <button onClick={resetForm} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5">Cancel</button>}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/8 text-xs uppercase tracking-wider text-white/50">
            <tr>
              <th className="px-3 py-2">Icon</th>
              <th className="px-3 py-2">Platform</th>
              <th className="px-3 py-2">URL</th>
              <th className="px-3 py-2">Label (ID)</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((l) => {
              const IconComp = ICON_MAP[l.icon]
              return (
                <tr key={l.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                  <td className="px-3 py-3">{IconComp ? <IconComp className="h-4 w-4 text-primary" /> : <span className="text-white/30">{l.icon}</span>}</td>
                  <td className="px-3 py-3 font-medium">{l.platform}</td>
                  <td className="px-3 py-3 text-white/60 max-w-[200px] truncate">{l.url}</td>
                  <td className="px-3 py-3 text-white/70">{l.label_id}</td>
                  <td className="px-3 py-3">
                    <span className={"rounded-full px-2.5 py-0.5 text-xs font-medium " + (l.is_active ? "bg-accent/20 text-accent" : "bg-white/10 text-white/40")}>
                      {l.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <AnimatedEditButton size="sm" onClick={() => { setEditId(l.id); setForm({ platform: l.platform, icon: l.icon, url: l.url, label_id: l.label_id, label_en: l.label_en, is_active: l.is_active }) }} />
                    <AnimatedDeleteButton size="sm" onClick={() => setDeleteTarget(l.id)} />
                  </td>
                </tr>
              )
            })}
            {links.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-white/30">No social links yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDelete open={!!deleteTarget} title="Social Link" onConfirm={confirmDelete} onCancel={() => { setDeleteTarget(null); setDeleting(false) }} deleting={deleting} />
    </motion.div>
  )
}
