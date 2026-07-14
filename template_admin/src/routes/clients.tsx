import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Plus, FileDown, Sheet, ArrowUpDown, MoreHorizontal, Trash2, Pencil, X,
  Loader2, Mail, Building2, Calendar, CheckCircle2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/clients")({
  component: Clients,
  head: () => ({
    meta: [
      { title: "Clients — Vascode Admin" },
      { name: "description", content: "Manage clients, project status, and exports." },
    ],
  }),
});

type Status = "Active" | "Completed" | "Pending";
type Client = {
  id: string; name: string; company: string; email: string;
  status: Status; joined: string; projects: number;
};

const rows: Client[] = [
  { id: "c1", name: "Anggun Prameswari", company: "PT Nusantara Kreatif", email: "anggun@nusantara.co.id", status: "Active", joined: "2025-11-04", projects: 4 },
  { id: "c2", name: "Marco de Vries", company: "Studio Fern", email: "marco@studiofern.co", status: "Pending", joined: "2026-01-12", projects: 1 },
  { id: "c3", name: "Sinta Wulandari", company: "Kopi Kula", email: "sinta@kopikula.id", status: "Completed", joined: "2024-08-21", projects: 7 },
  { id: "c4", name: "Rafi Hakim", company: "Aurora Media", email: "rafi@auroramedia.tv", status: "Active", joined: "2025-06-30", projects: 3 },
  { id: "c5", name: "Elena Sørensen", company: "Nord & Nord", email: "elena@nordnord.dk", status: "Active", joined: "2025-09-14", projects: 5 },
  { id: "c6", name: "Bagas Pratama", company: "Rimba Threads", email: "bagas@rimba.id", status: "Pending", joined: "2026-02-02", projects: 1 },
  { id: "c7", name: "Kaia Whitfield", company: "Bloom Botanicals", email: "kaia@bloombot.co", status: "Completed", joined: "2024-04-19", projects: 6 },
  { id: "c8", name: "Dimas Ari", company: "Loka Coffee", email: "dimas@loka.coffee", status: "Active", joined: "2025-12-08", projects: 2 },
];

const statusStyles: Record<Status, string> = {
  Active: "bg-primary/20 text-primary-foreground border-primary/30",
  Completed: "bg-accent/20 text-accent border-accent/30",
  Pending: "bg-white/10 text-white/60 border-white/10",
};

function Clients() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [sort, setSort] = useState<{ key: keyof Client; dir: "asc" | "desc" }>({ key: "joined", dir: "desc" });
  const [selected, setSelected] = useState<string[]>([]);
  const [openDrawer, setOpenDrawer] = useState<Client | null>(null);
  const [exporting, setExporting] = useState<"pdf" | "xlsx" | null>(null);

  const filtered = useMemo(() => {
    let out = rows.filter((r) => {
      const matchQ = !query || (r.name + r.company + r.email).toLowerCase().includes(query.toLowerCase());
      const matchS = status === "all" || r.status === status;
      return matchQ && matchS;
    });
    out = [...out].sort((a, b) => {
      const av = a[sort.key]; const bv = b[sort.key];
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return out;
  }, [query, status, sort]);

  const toggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map((r) => r.id));
  };
  const toggleOne = (id: string) => {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  };

  const runExport = (kind: "pdf" | "xlsx") => {
    setExporting(kind);
    setTimeout(() => {
      setExporting(null);
      toast.success(`Exported ${filtered.length} clients to ${kind.toUpperCase()}`);
    }, 1400);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients <span className="text-gradient">CRM</span></h1>
          <p className="mt-1 text-sm text-white/50">{filtered.length} of {rows.length} records</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => runExport("pdf")}
            disabled={!!exporting}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium transition hover:bg-white/10 disabled:opacity-60"
          >
            {exporting === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            Export PDF
          </button>
          <button
            onClick={() => runExport("xlsx")}
            disabled={!!exporting}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium transition hover:bg-white/10 disabled:opacity-60"
          >
            {exporting === "xlsx" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sheet className="h-4 w-4" />}
            Export Excel
          </button>
          <button
            onClick={() => toast.success("Opened new-client form")}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Add Client
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, company, or email…"
            className="h-10 w-full rounded-full border border-white/8 bg-white/5 pl-10 pr-4 text-sm placeholder:text-white/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="h-10 w-40 rounded-full border-white/10 bg-white/5 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/8 text-xs uppercase tracking-wider text-white/50">
              <tr>
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    checked={selected.length > 0 && selected.length === filtered.length}
                    onCheckedChange={toggleAll}
                  />
                </th>
                {([
                  ["name", "Client"], ["company", "Company"], ["email", "Email"],
                  ["status", "Status"], ["joined", "Joined"],
                ] as [keyof Client, string][]).map(([key, label]) => (
                  <th key={key} className="px-4 py-3 font-semibold">
                    <button
                      onClick={() => setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }))}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      {label}
                      <ArrowUpDown className={cn("h-3 w-3", sort.key === key ? "text-accent" : "opacity-40")} />
                    </button>
                  </th>
                ))}
                <th className="w-24 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setOpenDrawer(r)}
                  className="cursor-pointer border-b border-white/5 transition hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selected.includes(r.id)} onCheckedChange={() => toggleOne(r.id)} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary/40 to-accent/30 text-xs font-bold text-white">
                        {r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="font-semibold">{r.name}</div>
                        <div className="text-xs text-white/40">{r.projects} projects</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-white/80">{r.company}</td>
                  <td className="px-4 py-4 text-white/60">{r.email}</td>
                  <td className="px-4 py-4">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", statusStyles[r.status])}>
                      <span className={cn("h-1.5 w-1.5 rounded-full",
                        r.status === "Active" ? "bg-primary" : r.status === "Completed" ? "bg-accent" : "bg-white/40",
                      )} />
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-white/60">{r.joined}</td>
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                      <button className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-destructive/20 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                      <button className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-foreground"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-white/5 px-4 py-3 text-xs text-white/50">
          <span>Showing {filtered.length} of {rows.length}</span>
          <div className="flex items-center gap-1">
            {["‹", "1", "2", "3", "›"].map((p, i) => (
              <button
                key={i}
                className={cn(
                  "grid h-8 min-w-8 place-items-center rounded-full px-2 text-xs font-semibold transition",
                  p === "1" ? "bg-primary text-primary-foreground" : "text-white/60 hover:bg-white/10 hover:text-foreground",
                )}
              >{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            className="fixed inset-x-0 bottom-6 z-30 flex justify-center px-4"
          >
            <div className="glass-strong flex items-center gap-3 rounded-full px-5 py-3 shadow-2xl">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span className="font-semibold">{selected.length}</span> selected
              </div>
              <div className="h-6 w-px bg-white/10" />
              <button className="text-sm font-medium hover:text-accent">Export</button>
              <button className="text-sm font-medium text-destructive hover:brightness-110">Delete</button>
              <button onClick={() => setSelected([])} className="grid h-7 w-7 place-items-center rounded-full text-white/60 hover:bg-white/10">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {openDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpenDrawer(null)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col glass-strong border-l border-white/10"
            >
              <div className="flex items-center justify-between border-b border-white/8 p-5">
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/40">Client details</div>
                  <div className="mt-1 text-lg font-bold">{openDrawer.name}</div>
                </div>
                <button onClick={() => setOpenDrawer(null)} className="grid h-9 w-9 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto p-5">
                <div className="flex items-center gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-lg font-bold text-black">
                    {openDrawer.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="text-sm text-white/60">{openDrawer.company}</div>
                    <span className={cn("mt-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", statusStyles[openDrawer.status])}>
                      {openDrawer.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <InfoRow icon={Mail} label="Email" value={openDrawer.email} />
                  <InfoRow icon={Building2} label="Company" value={openDrawer.company} />
                  <InfoRow icon={Calendar} label="Joined" value={openDrawer.joined} />
                </div>

                <div>
                  <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">Project timeline</div>
                  <ol className="relative space-y-4 border-l border-white/10 pl-5">
                    {[
                      { t: "Discovery call", d: "2025-11-04", s: "Completed" },
                      { t: "Brand strategy workshop", d: "2025-11-18", s: "Completed" },
                      { t: "Website design v1", d: "2025-12-10", s: "Active" },
                      { t: "Launch & handoff", d: "2026-02-01", s: "Pending" },
                    ].map((e, i) => (
                      <li key={i}>
                        <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-gradient-to-br from-primary to-accent" />
                        <div className="text-sm font-semibold">{e.t}</div>
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <span>{e.d}</span>·<span>{e.s}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="flex gap-2 border-t border-white/8 p-5">
                <button className="flex-1 rounded-full border border-white/10 bg-white/5 py-2.5 text-sm font-medium hover:bg-white/10">Send email</button>
                <button className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">Edit client</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-white/60">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-widest text-white/40">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
