import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, FileText, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", to: "/", icon: LayoutDashboard },
  { title: "Clients", to: "/clients", icon: Users },
  { title: "Content", to: "/content", icon: FileText },
  { title: "Settings", to: "/settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="sticky top-0 z-20 hidden h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-[hsl(240_3%_13%)]/80 backdrop-blur-xl md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
          <Sparkles className="h-4 w-4 text-black" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-gradient">VASCODE</div>
          <div className="text-[10px] uppercase tracking-widest text-white/40">Admin Panel</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary/15 text-foreground"
                  : "text-white/60 hover:bg-white/5 hover:text-foreground",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary to-accent" />
              )}
              <Icon className={cn("h-4 w-4", active && "text-accent")} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="glass m-3 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-xs font-medium text-white/70">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          All systems operational
        </div>
        <p className="mt-1 text-[11px] text-white/40">v2.4.1 · Uptime 99.98%</p>
      </div>
    </aside>
  );
}
