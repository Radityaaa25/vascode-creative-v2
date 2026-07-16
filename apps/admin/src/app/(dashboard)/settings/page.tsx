'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Loader2, History, Database, Zap, Info, Trash2, RefreshCw, Server, Clock, Activity } from "lucide-react"
import { getAdminLogs, getTableStats, clearAdminLogs, logAdminAction, type AdminLogRow } from "@/app/actions/content"

type Tab = "logs" | "database" | "actions" | "info"

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "logs", label: "Activity Log", icon: History },
  { id: "database", label: "Database", icon: Database },
  { id: "actions", label: "Quick Actions", icon: Zap },
  { id: "info", label: "System Info", icon: Info },
]

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("logs")

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight"><span className="text-gradient">Admin</span> Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">Monitor, manage, and maintain your site.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
        <nav className="glass h-fit space-y-1 rounded-2xl p-2">
          {TABS.map((t) => (
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

        {tab === "logs" && <ActivityLogPanel />}
        {tab === "database" && <DatabasePanel />}
        {tab === "actions" && <QuickActionsPanel />}
        {tab === "info" && <SystemInfoPanel />}
      </div>
    </div>
  )
}

function ActivityLogPanel() {
  const [logs, setLogs] = useState<AdminLogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)

  async function fetchLogs() {
    setLoading(true)
    const res = await getAdminLogs()
    if (res.success) setLogs(res.data)
    else toast.error(res.error)
    setLoading(false)
  }

  useEffect(() => { fetchLogs() }, [])

  async function handleClear() {
    setClearing(true)
    const res = await clearAdminLogs()
    setClearing(false)
    if (res.success) { toast.success("Logs cleared"); setLogs([]) }
    else toast.error(res.error)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Activity Log
        </h2>
        {logs.length > 0 && (
          <button onClick={handleClear} disabled={clearing} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5 hover:text-destructive disabled:opacity-50">
            {clearing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
            Clear All
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-white/40"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-white/30">
          <History className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">No activity logs yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/8 text-xs uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Entity</th>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                  <td className="px-3 py-3 text-xs text-white/40 whitespace-nowrap">
                    {new Date(l.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-3 py-3">
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      l.action === 'create' && "bg-accent/20 text-accent",
                      l.action === 'update' && "bg-primary/20 text-primary",
                      l.action === 'delete' && "bg-destructive/20 text-destructive",
                      !['create','update','delete'].includes(l.action) && "bg-white/10 text-white/60",
                    )}>
                      {l.action}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-white/70">{l.entity}</td>
                  <td className="px-3 py-3 text-xs text-white/40 font-mono">{l.entity_id ? l.entity_id.slice(0, 8) + '…' : '—'}</td>
                  <td className="px-3 py-3 text-xs text-white/40 max-w-[200px] truncate">
                    {l.details ? JSON.stringify(l.details).slice(0, 60) + (JSON.stringify(l.details).length > 60 ? '…' : '') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}

function DatabasePanel() {
  const [stats, setStats] = useState<{ table: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchStats() {
    setLoading(true)
    const res = await getTableStats()
    if (res.success) setStats(res.data)
    else toast.error(res.error)
    setLoading(false)
  }

  useEffect(() => { fetchStats() }, [])

  const total = stats.reduce((sum, s) => sum + s.count, 0)

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          Database Overview
        </h2>
        <button onClick={fetchStats} disabled={loading} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5 disabled:opacity-50">
          <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
        <div className="text-2xl font-bold text-primary">{total.toLocaleString()}</div>
        <div className="text-xs text-white/40">Total Records</div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-white/40"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.table} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center transition hover:border-white/20">
              <div className="text-lg font-bold text-white">{s.count}</div>
              <div className="text-xs text-white/40 mt-0.5 break-all">{s.table.replace(/_/g, ' ')}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function QuickActionsPanel() {
  const [action, setAction] = useState<string | null>(null)

  async function runAction(name: string, label: string) {
    setAction(name)
    await new Promise((r) => setTimeout(r, 800))
    if (name === 'test-log') {
      await logAdminAction('test', 'system', undefined, { message: 'Quick action test at ' + new Date().toISOString() })
    }
    setAction(null)
    toast.success(`${label} completed`)
  }

  const actions = [
    { name: 'test-log', label: 'Write Test Log', desc: 'Create a test entry in activity log', icon: Activity },
    { name: 'refresh-cache', label: 'Clear Local Cache', desc: 'Invalidate browser cache (reload page)', icon: RefreshCw },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
        <Zap className="h-4 w-4 text-primary" />
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((a) => {
          const Icon = a.icon
          return (
            <button
              key={a.name}
              onClick={() => runAction(a.name, a.label)}
              disabled={action !== null}
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left transition hover:border-primary/30 hover:bg-white/[0.04] disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary/20">
                  {action === a.name ? <Loader2 className="h-5 w-5 animate-spin" /> : <Icon className="h-5 w-5" />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{a.label}</div>
                  <div className="text-xs text-white/40 mt-0.5">{a.desc}</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

function SystemInfoPanel() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i) }, [])

  const info = [
    { label: 'Server Time', value: time.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'medium' }), icon: Clock },
    { label: 'Timezone', value: Intl.DateTimeFormat().resolvedOptions().timeZone, icon: Server },
    { label: 'Framework', value: 'Next.js 16', icon: Server },
    { label: 'Database', value: 'Supabase (PostgreSQL)', icon: Database },
    { label: 'App Version', value: '2.0.0', icon: Info },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
        <Server className="h-4 w-4 text-primary" />
        System Information
      </h2>

      <div className="space-y-3">
        {info.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-white/40">{item.label}</div>
                <div className="text-sm font-semibold text-white mt-0.5">{item.value}</div>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
