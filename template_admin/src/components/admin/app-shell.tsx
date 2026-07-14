import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { AmbientBackground } from "./ambient-background";
import { AIAssistant } from "./ai-assistant";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full text-foreground">
      <AmbientBackground />
      <Sidebar />
      <div className="relative z-10 flex min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="flex-1 px-6 py-6 md:px-8 md:py-8">{children}</main>
      </div>
      <AIAssistant />
    </div>
  );
}
