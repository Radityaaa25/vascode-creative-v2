'use client'

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-white/60">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-destructive/20 text-destructive">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </div>
      <p className="text-sm font-medium">Something went wrong</p>
      <p className="text-xs text-white/40">{error.message}</p>
      <button onClick={reset} className="mt-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold hover:bg-white/10">
        Try again
      </button>
    </div>
  )
}
