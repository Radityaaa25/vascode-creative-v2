# Product Requirements Document (PRD) — Vascode Creative V2

## 1. Ringkasan Produk

**Vascode Creative V2** adalah sistem terpadu (monorepo) yang mencakup dua aplikasi utama:
1. **Client SPA (Landing Page):** *Digital storefront* untuk menampilkan layanan, portofolio, dan saluran komunikasi langsung dengan calon klien.
2. **Admin CRM (Dashboard):** Sistem manajemen internal untuk mengelola klien, leads, proyek, dan interaksi yang terintegrasi dengan AI Assistant.

- **Nama Proyek:** vascode_V2 (Monorepo)
- **Aplikasi 1 (Client):** Vite + React + shadcn/ui (`apps/app`)
- **Aplikasi 2 (Admin CRM):** Next.js 16 + Supabase + Tailwind CSS v4 (`apps/admin`)
- **URL Target:** [vascode.my.id](https://vascode.my.id)

---

## 2. Tujuan & Sasaran

| Tujuan | Deskripsi |
|--------|-----------|
| **Brand Awareness** | Memperkenalkan Vascode Creative sebagai agensi kreatif & production house profesional. |
| **Lead Generation** | Mengonversi pengunjung menjadi klien melalui WhatsApp langsung dari setiap layanan. |
| **Client Management** | Mengelola data klien (CRM), proyek, dan leads melalui dashboard Admin yang aman dan efisien. |
| **Portfolio Showcase** | Menampilkan karya terbaik dengan filter kategori & modal detail. |

---

## 3. Arsitektur & Struktur Proyek (Monorepo)

Proyek ini menggunakan arsitektur monorepo dengan **pnpm workspaces** dan **Turborepo** untuk efisiensi build dan pengelolaan dependency.

```text
vascode_V2/
├── apps/
│   ├── admin/           # Next.js 16 Admin CRM Dashboard
│   └── app/             # Vite + React 18 Landing Page SPA
├── package.json         # Root workspace configuration
├── pnpm-workspace.yaml  # Workspace mapping
├── turbo.json           # Turborepo task pipeline
└── README.md            # Dokumentasi utama proyek
```

---

## 4. Aplikasi 1: Client SPA (Landing Page)

### 4.1 Tech Stack
- **Framework:** React 18.3 + TypeScript 5.8
- **Bundler:** Vite 5.4
- **Styling:** Tailwind CSS 3.4 + `tailwindcss-animate`
- **UI Components:** shadcn/ui (Radix primitives)
- **Animasi:** Framer Motion 12
- **Routing:** React Router 6
- **Data Fetching:** TanStack React Query 5

### 4.2 Fitur & Fungsionalitas Utama
- **Hero Section:** *Tagline* animasi, 2 CTA buttons ("Start Your Project", "View Our Work").
- **Services Section:** Grid layanan kreatif terintegrasi dengan WhatsApp redirect.
- **Portfolio Section:** Filter kategori proyek dengan modal detail interaktif.
- **Sistem Bilingual:** Dukungan EN/ID penuh dengan `LanguageContext`.
- **Desain & Animasi:** Efek *glassmorphism*, gradient text, *hover lift*, dan animasi transisi.

---

## 5. Aplikasi 2: Admin CRM (Dashboard)

### 5.1 Tech Stack
- **Framework:** Next.js 16.2 (App Router) + React 19
- **Database & Auth:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui + Base UI
- **AI Integration:** Vercel AI SDK (`@ai-sdk/react`, `@ai-sdk/openai`, `@ai-sdk/groq`)
- **Data Visualization & Export:** Recharts, jsPDF, xlsx

### 5.2 Fitur & Fungsionalitas Utama
- **Manajemen Klien & Proyek:** Skema database komprehensif (`schema_client_crm.sql`, `schema_v2.sql`) untuk melacak leads, klien aktif, dan status proyek.
- **AI Assistant:** Terintegrasi langsung di dashboard (`ai-assistant.tsx`) untuk membantu admin dalam analisis data dan drafting pesan.
- **Data Export:** Dukungan eksport laporan ke PDF dan Excel.

---

## 6. Strategi Deployment & Scripts

### 6.1 Root Scripts
- `pnpm run dev` — Menjalankan development server untuk semua aplikasi (`turbo run dev`).
- `pnpm run build` — Melakukan build untuk production.
- `pnpm run lint` — Menjalankan linter terpadu.

### 6.2 Deployment
- **Client App (`apps/app`):** GitHub Pages (via `gh-pages`).
- **Admin App (`apps/admin`):** Vercel atau platform hosting serverless yang mendukung Next.js & Supabase.

---

## 7. Batasan & Catatan

- **Database:** Data portofolio pada Client SPA masih bersifat statis (*hardcoded*), sedangkan sistem CRM (Admin) sepenuhnya menggunakan Supabase (PostgreSQL).
- **Integrasi CRM:** Saat ini, konversi lead dari Client SPA (via WhatsApp) masih memerlukan input manual ke dalam sistem Admin CRM.
- **Single Page Application:** Halaman Client difokuskan pada pengalaman satu halaman yang responsif tanpa dynamic routing yang kompleks.
