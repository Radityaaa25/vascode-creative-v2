import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/top-bar"
import { AmbientBackground } from "@/components/layout/ambient-background"
import { AIAssistant } from "@/components/layout/ai-assistant"
import { LanguageProvider } from "@/components/providers/language-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <div className="relative flex min-h-screen w-full text-foreground">
        <AmbientBackground />
        <Sidebar />
        <div className="relative z-10 flex min-h-screen flex-1 flex-col">
          <TopBar />
          <main className="flex-1 px-6 py-6 md:px-8 md:py-8">{children}</main>
        </div>
        <AIAssistant />
      </div>
    </LanguageProvider>
  )
}
