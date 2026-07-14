import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: Settings,
  head: () => ({
    meta: [
      { title: "Settings — Vascode Admin" },
      { name: "description", content: "Workspace preferences and account settings." },
    ],
  }),
});

function Settings() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight"><span className="text-gradient">Settings</span></h1>
        <p className="mt-1 text-sm text-white/50">Workspace and account preferences.</p>
      </div>

      <div className="glass space-y-6 rounded-2xl p-6">
        {[
          { label: "Workspace name", value: "Vascode Creative" },
          { label: "Default language", value: "English (EN)" },
          { label: "Notifications email", value: "hello@vascode.co" },
          { label: "Timezone", value: "Asia/Jakarta (UTC+7)" },
        ].map((f) => (
          <div key={f.label} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
            <div>
              <div className="text-sm font-semibold">{f.label}</div>
              <div className="text-xs text-white/50">{f.value}</div>
            </div>
            <button className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold hover:bg-white/10">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
