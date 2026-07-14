'use client'

import { useMemo, useState, useEffect, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, FileDown, Sheet, ArrowUpDown, MoreHorizontal, Pencil, X,
  Loader2, Mail, Building2, Calendar, CheckCircle2, MessageCircle, ExternalLink,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import AnimatedDeleteButton from "@/components/ui/animated-delete-button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getClients, createClient, updateClient, deleteClient, type ClientCRM, type CreateClientInput } from "@/app/actions/clients";

type Status = "Active" | "Completed" | "Pending";

const statusStyles: Record<Status, string> = {
  Active: "bg-primary/20 text-primary-foreground border-primary/30",
  Completed: "bg-accent/20 text-accent border-accent/30",
  Pending: "bg-white/10 text-white/60 border-white/10",
};

const emptyForm: CreateClientInput = { name: "", company: "", email: "", phone_wa: "", status: "Active" };
const PAGE_SIZE = 10;

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientCRM[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [sort, setSort] = useState<{ key: keyof ClientCRM; dir: "asc" | "desc" }>({ key: "joined_at", dir: "desc" });
  const [selected, setSelected] = useState<string[]>([]);
  const [openDrawer, setOpenDrawer] = useState<ClientCRM | null>(null);
  const [exporting, setExporting] = useState<"pdf" | "xlsx" | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateClientInput>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<ClientCRM | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Dropdown state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    const res = await getClients();
    if (res.success) {
      setClients(res.data);
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  }

  const filtered = useMemo(() => {
    let out = clients.filter((r) => {
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
  }, [clients, query, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map((r) => r.id));
  };
  const toggleOne = (id: string) => {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  };

  // Export
  async function runExport(kind: "pdf" | "xlsx") {
    setExporting(kind);
    const data = filtered.length > 0 ? filtered : clients;

    if (kind === "pdf") {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");
      const doc = new jsPDF();
      doc.text("Client List", 14, 15);
      autoTable(doc, {
        startY: 22,
        head: [["Name", "Company", "Email", "Phone", "Status", "Projects", "Joined"]],
        body: data.map((c) => [c.name, c.company, c.email, c.phone_wa, c.status, String(c.projects_count), c.joined_at]),
        styles: { fontSize: 8 },
      });
      doc.save("clients.pdf");
    } else {
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(
        data.map((c) => ({ Name: c.name, Company: c.company, Email: c.email, Phone: c.phone_wa, Status: c.status, Projects: c.projects_count, Joined: c.joined_at }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Clients");
      XLSX.writeFile(wb, "clients.xlsx");
    }

    setExporting(null);
    toast.success(`Exported ${data.length} clients to ${kind.toUpperCase()}`);
  }

  // Modal handlers
  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(client: ClientCRM) {
    setEditingId(client.id);
    setForm({ name: client.name, company: client.company, email: client.email, phone_wa: client.phone_wa, status: client.status, joined_at: client.joined_at });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.company.trim()) {
      toast.error("Name and Company are required");
      return;
    }
    setSaving(true);
    const res = editingId
      ? await updateClient(editingId, form)
      : await createClient(form);
    setSaving(false);
    if (res.success) {
      toast.success(editingId ? "Client updated" : "Client created");
      setModalOpen(false);
      fetchClients();
    } else {
      toast.error(res.error);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await deleteClient(deleteTarget.id);
    setDeleting(false);
    if (res.success) {
      toast.success("Client deleted");
      setDeleteTarget(null);
      setOpenDrawer((d) => d?.id === deleteTarget.id ? null : d);
      fetchClients();
    } else {
      toast.error(res.error);
    }
  }

  async function executeBulkDelete() {
    setBulkDeleting(true);
    await Promise.all(selected.map((id) => deleteClient(id)));
    setBulkDeleting(false);
    setBulkDelete(false);
    toast.success(`Deleted ${selected.length} clients`);
    setSelected([]);
    fetchClients();
  }

  function handleBulkExport() {
    const data = clients.filter((c) => selected.includes(c.id));
    if (data.length === 0) return;
    runExport("xlsx");
  }

  // Close dropdown on click outside
  useEffect(() => {
    if (!openDropdown) return;
    const handler = () => setOpenDropdown(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openDropdown]);

  // Reset page when filters change
  useEffect(() => setPage(1), [query, status]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients <span className="text-gradient">CRM</span></h1>
          <p className="mt-1 text-sm text-white/50">{loading ? "Loading..." : `${filtered.length} of ${clients.length} records`}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => runExport("pdf")}
            disabled={!!exporting || clients.length === 0}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium transition hover:bg-white/10 disabled:opacity-60"
          >
            {exporting === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            Export PDF
          </button>
          <button
            onClick={() => runExport("xlsx")}
            disabled={!!exporting || clients.length === 0}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium transition hover:bg-white/10 disabled:opacity-60"
          >
            {exporting === "xlsx" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sheet className="h-4 w-4" />}
            Export Excel
          </button>
          <button
            onClick={openAddModal}
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
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/40">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading clients...
          </div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/40">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white/5 mb-4">
              <Building2 className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium">No clients yet</p>
            <p className="text-xs mt-1">Add your first client to get started.</p>
            <button
              onClick={openAddModal}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" /> Add Client
            </button>
          </div>
        ) : (
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
                    ["phone_wa", "Phone"], ["status", "Status"], ["joined_at", "Joined"],
                  ] as [keyof ClientCRM, string][]).map(([key, label]) => (
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
                  <th className="w-28 px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r) => (
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
                          <div className="text-xs text-white/40">{r.projects_count} projects</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-white/80">{r.company}</td>
                    <td className="px-4 py-4 text-white/60">{r.email}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-xs">{r.phone_wa || "—"}</span>
                        {r.phone_wa && (
                          <a
                            href={`https://wa.me/${r.phone_wa}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="grid h-7 w-7 place-items-center rounded-full text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                            title="Chat via WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", statusStyles[r.status])}>
                        <span className={cn("h-1.5 w-1.5 rounded-full",
                          r.status === "Active" ? "bg-primary" : r.status === "Completed" ? "bg-accent" : "bg-white/40",
                        )} />
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white/60 whitespace-nowrap">{r.joined_at}</td>
                    <td className="px-4 py-4 relative" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditModal(r); }}
                          className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-foreground"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <AnimatedDeleteButton size="sm" onClick={(e) => { e.stopPropagation(); setDeleteTarget(r); }} />
                        <div className="relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === r.id ? null : r.id); }}
                            className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-foreground"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                          {openDropdown === r.id && (
                            <div
                              className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-xl border border-white/10 bg-background py-1 shadow-2xl"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => { openEditModal(r); setOpenDropdown(null); }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-white/80 hover:bg-white/5"
                              >
                                <Pencil className="h-3.5 w-3.5" /> Edit
                              </button>
                              <button
                                onClick={() => { setDeleteTarget(r); setOpenDropdown(null); }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/10"
                              >
                                <svg viewBox="0 0 69 76" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
                                  <path fill="currentColor" d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"/>
                                </svg>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {clients.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/5 px-4 py-3 text-xs text-white/50">
            <span>
              {filtered.length === 0
                ? "No results"
                : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`
              }
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition disabled:opacity-30 enabled:hover:bg-white/10 enabled:hover:text-foreground"
              >‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "grid h-8 min-w-8 place-items-center rounded-full px-2 text-xs font-semibold transition",
                    p === page ? "bg-primary text-primary-foreground" : "text-white/60 hover:bg-white/10 hover:text-foreground",
                  )}
                >{p}</button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition disabled:opacity-30 enabled:hover:bg-white/10 enabled:hover:text-foreground"
              >›</button>
            </div>
          </div>
        )}
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
              <button onClick={handleBulkExport} className="text-sm font-medium hover:text-accent">Export</button>
              <AnimatedDeleteButton size="sm" onClick={() => setBulkDelete(true)} />
              <button onClick={() => setSelected([])} className="grid h-7 w-7 place-items-center rounded-full text-white/60 hover:bg-white/10">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AlertDialog open={modalOpen} onOpenChange={(o) => !o && setModalOpen(false)}>
        <AlertDialogContent className="glass-strong border-white/10 sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{editingId ? "Edit Client" : "Add Client"}</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              {editingId ? "Update the client details below." : "Fill in the details to add a new client."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/60">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Client name"
                className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/60">Company *</label>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Company name"
                className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-white/60">Email</label>
                <input
                  value={form.email || ""}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-white/60">WhatsApp</label>
                <input
                  value={form.phone_wa || ""}
                  onChange={(e) => setForm({ ...form, phone_wa: e.target.value })}
                  placeholder="6281234567890"
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-white/60">Status</label>
                <Select value={form.status || "Active"} onValueChange={(v) => setForm({ ...form, status: v as Status })}>
                  <SelectTrigger className="h-10 w-full rounded-xl border-white/10 bg-white/5 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-white/60">Joined Date</label>
                <input
                  type="date"
                  value={form.joined_at || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setForm({ ...form, joined_at: e.target.value })}
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-white/10 bg-transparent hover:bg-white/5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-primary text-primary-foreground hover:brightness-110"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? "Update" : "Create"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => !deleting && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-background p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-destructive/20 text-destructive mx-auto">
                <svg viewBox="0 0 69 76" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                  <path fill="currentColor" d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"/>
                </svg>
              </div>
              <h3 className="mb-2 text-center text-lg font-bold">Delete Client?</h3>
              <p className="mb-6 text-center text-sm text-white/60">
                Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget.name}</span> from {deleteTarget.company}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium hover:bg-white/10 disabled:opacity-50"
                >Cancel</button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground hover:brightness-110 disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Delete"}
                </button>
              </div>
            </motion.div>
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
                  <InfoRow icon={MessageCircle} label="WhatsApp" value={openDrawer.phone_wa || "—"} />
                  <InfoRow icon={Building2} label="Company" value={openDrawer.company} />
                  <InfoRow icon={Calendar} label="Joined" value={openDrawer.joined_at} />
                </div>

                <div>
                  <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">Project timeline</div>
                  <ol className="relative space-y-4 border-l border-white/10 pl-5">
                    {[
                      { t: "Discovery call", d: openDrawer.joined_at, s: "Completed" },
                      { t: "Brand strategy workshop", d: openDrawer.joined_at, s: "Completed" },
                      { t: "Active project", d: openDrawer.joined_at, s: "Active" },
                      { t: "Launch & handoff", d: openDrawer.joined_at, s: "Pending" },
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
                {openDrawer.email && (
                  <a
                    href={`mailto:${openDrawer.email}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-2.5 text-sm font-medium hover:bg-white/10"
                  >
                    <Mail className="h-4 w-4" /> Send email
                  </a>
                )}
                {openDrawer.phone_wa && (
                  <a
                    href={`https://wa.me/${openDrawer.phone_wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-2.5 text-sm font-medium hover:bg-[#25D366]/20"
                  >
                    <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp
                  </a>
                )}
                <button
                  onClick={() => { openEditModal(openDrawer); }}
                  className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110"
                >
                  Edit client
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Bulk delete confirmation */}
      <AnimatePresence>
        {bulkDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => !bulkDeleting && setBulkDelete(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-background p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-destructive/20 text-destructive mx-auto">
                <svg viewBox="0 0 69 76" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                  <path fill="currentColor" d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"/>
                </svg>
              </div>
              <h3 className="mb-2 text-center text-lg font-bold">Delete {selected.length} clients?</h3>
              <p className="mb-6 text-center text-sm text-white/60">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setBulkDelete(false)}
                  disabled={bulkDeleting}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium hover:bg-white/10 disabled:opacity-50"
                >Cancel</button>
                <button
                  onClick={executeBulkDelete}
                  disabled={bulkDeleting}
                  className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground hover:brightness-110 disabled:opacity-50"
                >
                  {bulkDeleting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: ComponentType<{ className?: string }>; label: string; value: string }) {
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
