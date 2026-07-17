'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Loader2, Save, Mail, Instagram, ExternalLink } from "lucide-react"
import { getSettings, updateSettings } from "@/app/actions/content"
import { Field } from "@/components/content/shared"

export default function ContactTab({ onDirtyChange }: { onDirtyChange?: (v: boolean) => void }) {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sectionSaving, setSectionSaving] = useState(false)

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

  const set = (key: string) => (val: string) => {
    setSettings((s) => ({ ...s, [key]: val }))
    onDirtyChange?.(true)
  }

  async function handleSave() {
    setSaving(true)
    const keys = ["contact_whatsapp", "contact_email", "contact_instagram"]
    const updates = keys.map((k) => ({ key: k, value: settings[k] || "" }))
    const res = await updateSettings(updates)
    setSaving(false)
    if (res.success) { toast.success("Contact info saved"); onDirtyChange?.(false) }
    else toast.error(res.error)
  }

  async function handleSectionSave() {
    setSectionSaving(true)
    const keys = ["contact_title_id", "contact_title_en", "contact_subtitle_id", "contact_subtitle_en", "contact_desc_id", "contact_desc_en"]
    const updates = keys.map((k) => ({ key: k, value: settings[k] || "" }))
    const res = await updateSettings(updates)
    setSectionSaving(false)
    if (res.success) { toast.success("Section texts saved"); onDirtyChange?.(false) }
    else toast.error(res.error)
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-white/40"><Loader2 className="h-5 w-5 animate-spin" /></div>

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="glass space-y-5 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Contact — Section Texts</h2>
        </div>
        <Field label="Title" value={settings.contact_title_id || ""} onChange={set("contact_title_id")} />
        <Field label="Subtitle (Badge)" value={settings.contact_subtitle_id || ""} onChange={set("contact_subtitle_id")} />
        <Field label="Description" value={settings.contact_desc_id || ""} onChange={set("contact_desc_id")} textarea />
        <div className="border-t border-white/10 pt-4">
          <Field label="Title (EN)" value={settings.contact_title_en || ""} onChange={set("contact_title_en")} />
          <Field label="Subtitle (EN)" value={settings.contact_subtitle_en || ""} onChange={set("contact_subtitle_en")} />
          <Field label="Description (EN)" value={settings.contact_desc_en || ""} onChange={set("contact_desc_en")} textarea />
        </div>
        <button onClick={handleSectionSave} disabled={sectionSaving} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110 disabled:opacity-60">
          {sectionSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Section Texts
        </button>
      </div>

      <div className="glass space-y-5 rounded-2xl p-6">
        <h2 className="text-lg font-bold">Contact Info</h2>

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
      </div>
    </motion.div>
  )
}
