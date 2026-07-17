'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"
import { getSettings, updateSettings } from "@/app/actions/content"
import { Field, LangToggle, type Lang } from "@/components/content/shared"

export default function HeroTab({ onDirtyChange }: { onDirtyChange?: (v: boolean) => void }) {
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

  const set = (key: string) => (val: string) => {
    setSettings((s) => ({ ...s, [key]: val }))
    onDirtyChange?.(true)
  }

  async function handleSave() {
    setSaving(true)
    const keys = ["hero_title_id", "hero_title_en", "hero_desc_id", "hero_desc_en", "hero_cta1_id", "hero_cta1_en", "hero_cta2_id", "hero_cta2_en"]
    const updates = keys.map((k) => ({ key: k, value: settings[k] || "" }))
    const res = await updateSettings(updates)
    setSaving(false)
    if (res.success) { toast.success("Hero content saved"); onDirtyChange?.(false) }
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
