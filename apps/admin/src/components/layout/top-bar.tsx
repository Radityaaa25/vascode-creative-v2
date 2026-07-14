'use client'

import { useState } from "react";
import { Bell, Search, ChevronDown, Globe, LogOut } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/app/login/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";

export function TopBar() {
  const { lang, setLang, t } = useLanguage();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      toast.success(`${t.topbar.searchingFor} "${search}"...`, { description: t.topbar.searchNotice });
      setSearch("");
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
      <div className="relative w-full max-w-xl shrink-0">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 z-10" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          placeholder={t.topbar.searchPlaceholder}
          className="relative h-11 w-full rounded-full border border-white/10 bg-[hsl(240_3%_13%)]/60 backdrop-blur-xl pl-11 pr-4 text-sm text-foreground placeholder:text-white/40 shadow-lg transition-all focus:border-primary/50 focus:bg-[hsl(240_3%_13%)]/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
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
