import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Save, Upload, GripVertical, Trash2, Image as ImageIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/content")({
  component: Content,
  head: () => ({
    meta: [
      { title: "Content — Vascode Admin" },
      { name: "description", content: "Manage bilingual site content: hero, services, portfolio." },
    ],
  }),
});

type Tab = "hero" | "services" | "portfolio";
type Lang = "ID" | "EN";

function Content() {
  const [tab, setTab] = useState<Tab>("hero");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content <span className="text-gradient">CMS</span></h1>
        <p className="mt-1 text-sm text-white/50">Edit bilingual site sections with a live preview.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Vertical tabs */}
        <nav className="glass h-fit space-y-1 rounded-2xl p-2">
          {([
            { id: "hero", label: "Hero" },
            { id: "services", label: "Services" },
            { id: "portfolio", label: "Portfolio" },
          ] as { id: Tab; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition",
                tab === t.id ? "bg-primary/20 text-foreground" : "text-white/60 hover:bg-white/5 hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "hero" && <HeroEditor />}
        {tab === "services" && <ServicesEditor />}
        {tab === "portfolio" && <PortfolioEditor />}
      </div>
    </div>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-0.5 text-[11px] font-semibold">
      {(["ID", "EN"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            "rounded-full px-2.5 py-0.5 transition",
            lang === l ? "bg-primary text-primary-foreground" : "text-white/50 hover:text-foreground",
          )}
        >{l}</button>
      ))}
    </div>
  );
}

function FloatField({ label, value, onChange, lang, setLang, textarea, error }: {
  label: string; value: string; onChange: (v: string) => void;
  lang: Lang; setLang: (l: Lang) => void; textarea?: boolean; error?: string;
}) {
  const Element = textarea ? "textarea" : "input";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-widest text-white/50">{label}</label>
        <LangToggle lang={lang} setLang={setLang} />
      </div>
      <Element
        value={value}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        rows={textarea ? 4 : undefined}
        className={cn(
          "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/30",
          error ? "border-destructive/60 focus:border-destructive" : "border-white/10 focus:border-primary/50",
        )}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function HeroEditor() {
  const [lang, setLang] = useState<Lang>("EN");
  const [title, setTitle] = useState({ EN: "We craft brands people fall for.", ID: "Kami menciptakan brand yang dicintai." });
  const [tagline, setTagline] = useState({ EN: "Web, video, and photography for ambitious teams.", ID: "Web, video, dan fotografi untuk tim ambisius." });
  const [cta, setCta] = useState({ EN: "Start a project", ID: "Mulai proyek" });

  const setL = <T extends Record<Lang, string>>(setter: (v: T) => void, obj: T) => (v: string) => setter({ ...obj, [lang]: v });

  const save = () => toast.success("Hero content saved");

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px]">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass space-y-5 rounded-2xl p-6">
        <FloatField label="Headline" value={title[lang]} onChange={setL(setTitle, title)} lang={lang} setLang={setLang} />
        <FloatField label="Tagline" value={tagline[lang]} onChange={setL(setTagline, tagline)} lang={lang} setLang={setLang} textarea />
        <FloatField label="Primary CTA" value={cta[lang]} onChange={setL(setCta, cta)} lang={lang} setLang={setLang} />

        <div className="pt-2">
          <button onClick={save} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </motion.div>

      <PreviewCard title="Hero preview">
        <div className="text-xs text-white/40">/ home</div>
        <h2 className="mt-2 text-2xl font-extrabold leading-tight text-gradient">{title[lang]}</h2>
        <p className="mt-2 text-sm text-white/60">{tagline[lang]}</p>
        <button className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">{cta[lang]}</button>
      </PreviewCard>
    </div>
  );
}

function ServicesEditor() {
  const [lang, setLang] = useState<Lang>("EN");
  const services = ["Web Design", "Video Production", "Photography", "Video Editing", "Graphic Design"];
  const [selected, setSelected] = useState(0);
  const [text, setText] = useState({
    EN: "Websites that convert — engineered fast, styled beautifully.",
    ID: "Situs yang mengonversi — cepat, indah, dan performatif.",
  });

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px]">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass space-y-5 rounded-2xl p-6">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/50">Service</label>
          <div className="flex flex-wrap gap-2">
            {services.map((s, i) => (
              <button
                key={s}
                onClick={() => setSelected(i)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  selected === i
                    ? "border-primary/50 bg-primary/15 text-foreground"
                    : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10",
                )}
              >{s}</button>
            ))}
          </div>
        </div>

        <FloatField label={`Description — ${services[selected]}`} value={text[lang]} onChange={(v) => setText({ ...text, [lang]: v })} lang={lang} setLang={setLang} textarea />

        <button onClick={() => toast.success("Service updated")} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </motion.div>

      <PreviewCard title="Service card preview">
        <div className="text-xs text-white/40">/ services</div>
        <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-accent">{services[selected]}</div>
          <p className="mt-2 text-sm text-white/70">{text[lang]}</p>
        </div>
      </PreviewCard>
    </div>
  );
}

function PortfolioEditor() {
  const [items, setItems] = useState([
    { id: 1, title: "Aurora Rebrand", color: "from-primary to-accent" },
    { id: 2, title: "Kopi Kula Site", color: "from-fuchsia-500 to-primary" },
    { id: 3, title: "Nord & Nord Film", color: "from-accent to-emerald-400" },
    { id: 4, title: "Loka Coffee Photo", color: "from-blue-400 to-primary" },
  ]);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px]">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass space-y-5 rounded-2xl p-6">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/50">Upload media</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); toast.success("3 files uploaded"); }}
            className={cn(
              "rounded-2xl border-2 border-dashed p-8 text-center transition",
              dragOver ? "border-accent bg-accent/5" : "border-white/15 bg-white/[0.02] hover:border-white/25",
            )}
          >
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary">
              <Upload className="h-5 w-5" />
            </div>
            <div className="mt-3 text-sm font-medium">Drop images here or click to browse</div>
            <div className="text-xs text-white/40">PNG, JPG, WebP up to 10 MB each</div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-widest text-white/50">Display order</label>
            <button onClick={() => toast.success("Item added")} className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:brightness-110">
              <Plus className="h-3 w-3" /> Add project
            </button>
          </div>
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                <button className="cursor-grab text-white/40 hover:text-foreground"><GripVertical className="h-4 w-4" /></button>
                <div className={cn("h-10 w-14 rounded-lg bg-gradient-to-br", it.color)} />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{it.title}</div>
                  <div className="text-xs text-white/40">Web Design</div>
                </div>
                <button
                  onClick={() => { setItems(items.filter((x) => x.id !== it.id)); toast.success("Item deleted"); }}
                  className="grid h-8 w-8 place-items-center rounded-full text-white/50 hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button onClick={() => toast.success("Portfolio saved")} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </motion.div>

      <PreviewCard title="Portfolio grid preview">
        <div className="text-xs text-white/40">/ portfolio</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {items.slice(0, 4).map((it) => (
            <div key={it.id} className={cn("aspect-square rounded-lg bg-gradient-to-br p-2 text-[10px] font-semibold text-black/70", it.color)}>
              {it.title}
            </div>
          ))}
        </div>
      </PreviewCard>
    </div>
  );
}

function PreviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="lg:sticky lg:top-24 h-fit">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">
        <ImageIcon className="h-3 w-3" /> {title}
      </div>
      <div className="glass rounded-2xl p-5" style={{ backgroundColor: "hsl(240 3% 16% / 0.9)" }}>
        {children}
      </div>
    </div>
  );
}
