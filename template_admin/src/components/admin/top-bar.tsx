import { Bell, Search, ChevronDown, Globe } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
  const [lang, setLang] = useState<"ID" | "EN">("EN");

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/5 bg-background/60 px-6 backdrop-blur-xl md:px-8">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          placeholder="Search clients, projects, content…"
          className="h-10 w-full rounded-full border border-white/8 bg-white/5 pl-10 pr-4 text-sm text-foreground placeholder:text-white/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <button
        onClick={() => setLang(lang === "EN" ? "ID" : "EN")}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-3 text-xs font-semibold transition hover:bg-white/10"
      >
        <Globe className="h-3.5 w-3.5" />
        {lang}
      </button>

      <button className="relative grid h-10 w-10 place-items-center rounded-full border border-white/8 bg-white/5 transition hover:bg-white/10">
        <Bell className="h-4 w-4" />
        <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] font-bold text-black">
          3
        </span>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-white/8 bg-white/5 py-1 pl-1 pr-3 transition hover:bg-white/10">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-black">
            RA
          </div>
          <div className="hidden text-left md:block">
            <div className="text-xs font-semibold leading-tight">Rasya A.</div>
            <div className="text-[10px] text-white/50 leading-tight">Administrator</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-white/50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLang(lang === "EN" ? "ID" : "EN")}>
            Language: {lang}
          </DropdownMenuItem>
          <DropdownMenuItem>Preferences</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
