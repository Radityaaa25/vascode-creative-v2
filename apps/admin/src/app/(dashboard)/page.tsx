'use client'

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, Briefcase, Zap, MessageSquare, TrendingUp, TrendingDown,
  UserPlus, CheckCircle2, FileEdit, Upload, Loader2
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { CountUp } from "@/components/layout/count-up";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { getDashboardData } from "@/app/actions/dashboard";
import { useLanguage } from "@/components/providers/language-provider";
import { ViewAllButton } from "@/components/ui/view-all-button";

const PIE_COLORS = [
  "hsl(257 65% 57%)", 
  "hsl(77 100% 50%)", 
  "hsl(280 60% 65%)", 
  "hsl(200 70% 55%)", 
  "hsl(320 65% 60%)"
];

export default function DashboardPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('12m');

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      const res = await getDashboardData(timeRange);
      if (res.success) {
        setData(res.data);
      }
      setLoading(false);
    }
    fetchDashboard();
  }, [timeRange]);

  if (loading && !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { label: t.dashboard.totalClients, value: data?.totalClients || 0, delta: 0, up: true, icon: Users },
    { label: t.dashboard.totalProjects, value: data?.activeProjects || 0, delta: 0, up: true, icon: Briefcase },
    { label: t.dashboard.activeRevenue, value: data?.totalRevenue || 0, delta: 0, up: true, icon: Zap },
    { label: t.dashboard.newLeads, value: 0, delta: 0, up: false, icon: MessageSquare },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">
          {t.dashboard.welcomeBack}, <span className="text-gradient">Admin</span>
        </h1>
        <p className="mt-1 text-sm text-white/50">{t.dashboard.subtitle}</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.02 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 text-primary-foreground">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  s.up ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"
                }`}>
                  {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {s.up ? "+" : "-"}{s.delta}%
                </div>
              </div>
              <div className="mt-4 text-3xl font-extrabold tracking-tight">
                <CountUp to={s.value} />
              </div>
              <div className="mt-0.5 text-sm text-white/50">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5 lg:col-span-2 relative"
        >
          {loading && <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
          <ChartHeader title={t.dashboard.revenueActivityTitle} subtitle={t.dashboard.revenueActivitySub} filter={timeRange} setFilter={setTimeRange} />
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barViolet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(257 65% 67%)" />
                    <stop offset="100%" stopColor="hsl(257 65% 47%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 100% / 0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(0 0% 100% / 0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(0 0% 100% / 0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "hsl(0 0% 100% / 0.04)" }}
                  contentStyle={{
                    background: "hsl(240 3% 18% / 0.9)", border: "1px solid hsl(0 0% 100% / 0.1)",
                    borderRadius: 12, backdropFilter: "blur(12px)", fontSize: 12,
                  }}
                />
                <Bar dataKey="Total" fill="url(#barViolet)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="glass rounded-2xl p-5 relative"
        >
          {loading && <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
          <ChartHeader title={t.dashboard.clientStatusTitle} subtitle={t.dashboard.clientStatusSub} filter={timeRange} setFilter={setTimeRange} />
          <div className="mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.clientStatusData || []} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                  {(data?.clientStatusData || []).map((e: any, idx: number) => <Cell key={e.name} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{
                  background: "hsl(240 3% 18% / 0.9)", border: "1px solid hsl(0 0% 100% / 0.1)",
                  borderRadius: 12, fontSize: 12,
                }} />
                <Legend
                  verticalAlign="middle" layout="vertical" align="right"
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(v) => <span className="text-white/70">{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center">
            <div className="text-2xl font-extrabold"><CountUp to={data?.activeProjects || 0} /></div>
            <div className="text-[11px] uppercase tracking-widest text-white/40">{t.dashboard.totalProjectsLabel}</div>
          </div>
        </motion.div>
      </div>

      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">{t.dashboard.recentActivityTitle}</h3>
            <p className="text-xs text-white/50">{t.dashboard.recentActivitySub}</p>
          </div>
          <Link href="/clients">
            <ViewAllButton text={t.dashboard.viewAll} />
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-white/5">
          {(data?.recentActivity || []).length > 0 ? (
            data.recentActivity.map((a: any, i: number) => {
              const Icon = a.icon === 'Briefcase' ? Briefcase : Users;
              return (
                <li key={i} className="flex items-center gap-3 py-3">
                  <div className={`grid h-9 w-9 place-items-center rounded-full text-accent bg-accent/15`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-sm">{a.title}: {a.description}</div>
                  <div className="text-xs text-white/40">{new Date(a.time).toLocaleString()}</div>
                </li>
              );
            })
          ) : (
            <li className="py-4 text-center text-sm text-white/40">{t.dashboard.noRecentActivity}</li>
          )}
        </ul>
      </motion.div>
    </div>
  );
}

function ChartHeader({ title, subtitle, filter, setFilter }: { title: string; subtitle: string; filter: string; setFilter: (val: string) => void }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-xs text-white/50">{subtitle}</p>
      </div>
      <Select value={filter} onValueChange={(v) => v !== null && setFilter(v)}>
        <SelectTrigger className="h-8 w-auto gap-1.5 rounded-full border-white/10 bg-white/5 px-3 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="12m">Last 12 months</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
