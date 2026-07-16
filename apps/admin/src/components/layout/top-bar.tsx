'use client'

import { useState, useEffect, useRef } from "react";
import { Bell, Search, ChevronDown, Globe, LogOut, Layout, Users } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/app/login/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { getClients, type ClientCRM } from "@/app/actions/clients";

const ROUTES = [
  { label: "Dashboard", path: "/", keywords: ["dashboard", "home", "beranda", "stats", "statistik"], icon: Layout },
  { label: "Clients Database", path: "/clients", keywords: ["client", "klien", "customer", "pelanggan", "database"], icon: Users },
  { label: "Content CMS", path: "/content", keywords: ["content", "konten", "portfolio", "tools", "faq", "hero", "service", "layanan", "about", "tentang", "karya", "cms"], icon: Globe },
  { label: "Settings", path: "/settings", keywords: ["setting", "pengaturan", "password", "profile", "akun", "account"], icon: Bell }
];

export function TopBar() {
  const { lang, setLang, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [clients, setClients] = useState<ClientCRM[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    getClients().then(res => {
      if (res.success) setClients(res.data);
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const q = search.trim().toLowerCase();
  const suggestedRoutes = q ? ROUTES.filter(r => r.keywords.some(kw => kw.includes(q)) || r.label.toLowerCase().includes(q)) : [];
  const suggestedClients = q ? clients.filter(c => (c.name + c.company + c.email).toLowerCase().includes(q)).slice(0, 5) : [];

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      if (suggestedRoutes.length > 0) {
        toast.success(`Navigating to ${suggestedRoutes[0].path}...`);
        router.push(suggestedRoutes[0].path);
      } else {
        toast.success(`Searching clients for "${search}"...`);
        router.push(`/clients?q=${encodeURIComponent(search.trim())}`);
      }
      setSearch("");
      setShowSuggestions(false);
    }
  };

  const handleLangToggle = () => {
    const newLang = lang === "EN" ? "ID" : "EN";
    setLang(newLang);
    toast.success(`${t.topbar.languageSwitched} ${newLang}`, { description: t.topbar.languageNotice });
  };

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between bg-transparent px-6 md:px-8 gap-4">
      {/* Spacer to balance the layout and keep search centered */}
      <div className="hidden flex-1 md:block" />

      {/* Centered Search Bar */}
      <div className="relative w-full max-w-xl shrink-0" ref={containerRef}>
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 z-10" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleSearch}
          placeholder={t.topbar.searchPlaceholder}
          className="relative h-11 w-full rounded-full border border-white/10 bg-[hsl(240_3%_13%)]/60 backdrop-blur-xl pl-11 pr-4 text-sm text-foreground placeholder:text-white/40 shadow-lg transition-all focus:border-primary/50 focus:bg-[hsl(240_3%_13%)]/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        
        {/* Suggestions Dropdown */}
        {showSuggestions && search.trim() && (suggestedRoutes.length > 0 || suggestedClients.length > 0) && (
          <div className="absolute left-0 top-[calc(100%+8px)] w-full rounded-2xl border border-white/10 bg-[hsl(240_3%_10%)]/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col py-2 z-50">
            {suggestedRoutes.length > 0 && (
              <div className="px-2 pb-2">
                <div className="px-3 py-1 text-xs font-semibold text-white/40 uppercase tracking-wider">Pages</div>
                {suggestedRoutes.map(r => (
                  <button key={r.path} onClick={() => { router.push(r.path); setShowSuggestions(false); setSearch(""); }} className="w-full text-left flex items-center px-3 py-2 rounded-xl text-sm text-white/80 hover:bg-white/5 hover:text-white transition">
                    <r.icon className="mr-3 h-4 w-4 text-white/40" />
                    {r.label}
                  </button>
                ))}
              </div>
            )}
            
            {suggestedRoutes.length > 0 && suggestedClients.length > 0 && <div className="h-[1px] w-full bg-white/10 my-1" />}
            
            {suggestedClients.length > 0 && (
              <div className="px-2 pt-1">
                <div className="px-3 py-1 text-xs font-semibold text-white/40 uppercase tracking-wider">Clients ({suggestedClients.length})</div>
                {suggestedClients.map(c => (
                  <button key={c.id} onClick={() => { router.push(`/clients?q=${encodeURIComponent(c.name)}`); setShowSuggestions(false); setSearch(""); }} className="w-full text-left flex flex-col px-3 py-2 rounded-xl text-sm hover:bg-white/5 transition">
                    <span className="font-medium text-white/90">{c.name}</span>
                    <span className="text-xs text-white/50">{c.company} • {c.email}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Side Buttons */}
      <div className="flex flex-1 items-center justify-end gap-3 shrink-0">
        <button
          onClick={handleLangToggle}
          className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/10 bg-[hsl(240_3%_13%)]/60 backdrop-blur-xl px-4 text-xs font-semibold shadow-lg transition hover:bg-[hsl(240_3%_13%)]/80 hover:text-white"
        >
          <Globe className="h-4 w-4 text-white/70" />
          {lang}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-[hsl(240_3%_13%)]/60 backdrop-blur-xl py-1 pl-1 pr-4 shadow-lg transition hover:bg-[hsl(240_3%_13%)]/80 outline-none">
            <img src="/logo-icon.png" alt="Admin" className="h-9 w-9 rounded-full object-cover bg-black/50" />
            <div className="hidden text-left lg:block">
              <div className="text-xs font-semibold leading-tight">{t.topbar.admin}</div>
              <div className="text-[10px] text-white/50 leading-tight">{t.topbar.administrator}</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-white/50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-2xl border-white/10 bg-[hsl(240_3%_13%)]/95 backdrop-blur-xl p-2 shadow-2xl">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-white/50 uppercase tracking-widest px-2 pt-1">{t.topbar.myAccount}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/10 my-2" />
            <DropdownMenuItem onClick={() => router.push('/settings')} className="rounded-xl px-3 py-2 cursor-pointer hover:bg-white/5 focus:bg-white/5">
              {t.topbar.accountSettings}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10 my-2" />
            <DropdownMenuItem 
              className="rounded-xl px-3 py-2 cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
              onClick={async () => {
                await logoutAction();
                window.location.href = '/login';
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t.topbar.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
