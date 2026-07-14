import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Users, Briefcase, Zap, MessageSquare, TrendingUp, TrendingDown,
  UserPlus, CheckCircle2, FileEdit, Upload,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { CountUp } from "@/components/admin/count-up";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — Vascode Admin" },
      { name: "description", content: "Real-time analytics, clients, and projects at a glance." },
    ],
  }),
});

const stats = [
  { label: "Total Clients", value: 248, delta: 12, up: true, icon: Users },
  { label: "Total Projects", value: 512, delta: 8, up: true, icon: Briefcase },
  { label: "Active Projects", value: 37, delta: 3, up: true, icon: Zap },
  { label: "New Leads", value: 94, delta: 4, up: false, icon: MessageSquare },
];

const barData = [
  { m: "Jan", v: 12 }, { m: "Feb", v: 18 }, { m: "Mar", v: 22 },
  { m: "Apr", v: 17 }, { m: "May", v: 28 }, { m: "Jun", v: 32 },
  { m: "Jul", v: 24 }, { m: "Aug", v: 38 }, { m: "Sep", v: 42 },
  { m: "Oct", v: 35 }, { m: "Nov", v: 48 }, { m: "Dec", v: 54 },
];

const pieData = [
  { name: "Web Design", value: 34, color: "hsl(257 65% 57%)" },
  { name: "Video Production", value: 22, color: "hsl(77 100% 50%)" },
  { name: "Photography", value: 18, color: "hsl(280 60% 65%)" },
  { name: "Video Editing", value: 14, color: "hsl(200 70% 55%)" },
  { name: "Graphic Design", value: 12, color: "hsl(320 65% 60%)" },
];

const activities = [
  { icon: UserPlus, color: "text-accent bg-accent/15", text: "New client added: PT Nusantara Kreatif", time: "2m ago" },
  { icon: CheckCircle2, color: "text-primary bg-primary/20", text: "Project 'Aurora Rebrand' marked as Completed", time: "18m ago" },
  { icon: FileEdit, color: "text-blue-400 bg-blue-400/15", text: "Hero content updated (ID + EN)", time: "1h ago" },
  { icon: Upload, color: "text-fuchsia-400 bg-fuchsia-400/15", text: "12 new portfolio images uploaded", time: "3h ago" },
  { icon: MessageSquare, color: "text-accent bg-accent/15", text: "New lead from contact form: hello@studiofern.co", time: "5h ago" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, <span className="text-gradient">Rasya</span>
        </h1>
        <p className="mt-1 text-sm text-white/50">Here's what's happening across your creative studio today.</p>
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
          className="glass rounded-2xl p-5 lg:col-span-2"
        >
          <ChartHeader title="New Clients" subtitle="Monthly acquisitions over the last year" />
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barViolet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(257 65% 67%)" />
                    <stop offset="100%" stopColor="hsl(257 65% 47%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 100% / 0.06)" vertical={false} />
                <XAxis dataKey="m" stroke="hsl(0 0% 100% / 0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(0 0% 100% / 0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "hsl(0 0% 100% / 0.04)" }}
                  contentStyle={{
                    background: "hsl(240 3% 18% / 0.9)", border: "1px solid hsl(0 0% 100% / 0.1)",
                    borderRadius: 12, backdropFilter: "blur(12px)", fontSize: 12,
                  }}
                />
                <Bar dataKey="v" fill="url(#barViolet)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="glass rounded-2xl p-5"
        >
          <ChartHeader title="Project Categories" subtitle="Distribution across services" />
          <div className="mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                  {pieData.map((e) => <Cell key={e.name} fill={e.color} />)}
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
            <div className="text-2xl font-extrabold"><CountUp to={512} /></div>
            <div className="text-[11px] uppercase tracking-widest text-white/40">Total projects</div>
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
            <h3 className="text-base font-semibold">Recent Activity</h3>
            <p className="text-xs text-white/50">Latest events across your workspace</p>
          </div>
          <button className="text-xs font-semibold text-accent hover:brightness-110">View all →</button>
        </div>
        <ul className="mt-4 divide-y divide-white/5">
          {activities.map((a, i) => {
            const Icon = a.icon;
            return (
              <li key={i} className="flex items-center gap-3 py-3">
                <div className={`grid h-9 w-9 place-items-center rounded-full ${a.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 text-sm">{a.text}</div>
                <div className="text-xs text-white/40">{a.time}</div>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}

function ChartHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-xs text-white/50">{subtitle}</p>
      </div>
      <Select defaultValue="12m">
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
