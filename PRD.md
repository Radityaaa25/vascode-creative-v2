# Product Requirements Document (PRD) — Vascode Creative

## 1. Ringkasan Produk

**Vascode Creative** adalah *landing page* satu halaman (single-page application) untuk agensi kreatif & *production house* modern. Website ini berfungsi sebagai *digital storefront* untuk menampilkan layanan, portofolio, dan menyediakan saluran komunikasi langsung dengan calon klien.

- **Nama Proyek:** vascode_V2 (vite_react_shadcn_ts)
- **URL Target:** [vascode.my.id](https://vascode.my.id)
- **Deployment:** GitHub Pages

---

## 2. Tujuan & Sasaran

| Tujuan | Deskripsi |
|--------|-----------|
| **Brand Awareness** | Memperkenalkan Vascode Creative sebagai agensi kreatif & production house profesional. |
| **Lead Generation** | Mengonversi pengunjung menjadi klien melalui WhatsApp langsung dari setiap layanan. |
| **Portfolio Showcase** | Menampilkan karya terbaik dengan filter kategori & modal detail. |
| **Kredibilitas** | Menampilkan statistik (50+ proyek, 30+ klien, 100% kepuasan) untuk membangun kepercayaan. |

---

## 3. Target Audiens

- **UKM & Startup** yang membutuhkan website, desain grafis, atau konten video.
- **Brand Lokal (Indonesia)** yang ingin *go digital* dengan konten media sosial (Instagram, TikTok).
- **Event Organizer** yang membutuhkan dokumentasi foto/video profesional.

---

## 4. Fitur & Fungsionalitas

### 4.1 Navigasi (Navbar)
- Logo + nama brand (VasCode Creative)
- Navigasi smooth-scroll ke 5 seksi: Home, Services, About, Portfolio, Contact
- Toggle bahasa **EN / ID** (bilingual penuh)
- Mobile menu dengan animasi (Hamburger → X)
- Efek *glassmorphism* saat di-scroll

### 4.2 Hero Section
- *Tagline* animasi dengan indikator *status live*
- Judul utama dengan gradien teks
- Deskripsi singkat
- **2 CTA buttons:**
  - "Start Your Project" → buka WhatsApp dengan pesan pra-isi
  - "View Our Work" → scroll halus ke seksi Portfolio
- *Animated background*: gradient orb, grid pattern, scroll indicator
- **State:** Loading tidak relevan (statis). *Empty state* tidak ada.

### 4.3 About Section
- Subtitle + juduk + deskripsi perusahaan
- **3 Statistik kunci:** 50+ Project, 30+ Clients, 100% Satisfaction
- Logo ikon animasi dengan elemen dekoratif melayang

### 4.4 Services Section
- **5 layanan dalam grid (3 kolom desktop):**
  1. Website Development
  2. Video Ads Production
  3. Photography & Videography
  4. Video & Photo Editing
  5. Graphic Design
- Setiap kartu: ikon, judul, deskripsi, tombol "Book Now"
- Tombol "Book Now" → buka WhatsApp dengan templat pesan spesifik per layanan (form otomatis)
- Animasi *hover lift* & *glow effect*
- **Error state:** Jika WhatsApp gagal dibuka (pop-up blocker), browser akan tetap membuka tab baru.

### 4.5 Portfolio Section
- Filter kategori: All, Website, Photo/Video, Design, Other
- Grid proyek (3 kolom desktop, 2 tablet, 1 mobile)
- Setiap kartu: gambar thumbnail, badge kategori, judul, deskripsi (2 baris), tombol "View Project"
- **Modal detail proyek:**
  - Gambar besar (16:9)
  - Badge kategori, judul, deskripsi penuh
  - Link ke proyek (jika ada)
  - Tombol close (X) + klik di luar modal
- **State:**
  - *Empty state:* Jika filter tidak menghasilkan proyek, grid tetap menampilkan animasi transisi keluar yang halus.
  - *Error state:* Gambar yang gagal load akan menampilkan placeholder abu-abu (tanpa alt broken image).

### 4.6 Contact Section
- 3 tombol kontak:
  - **WhatsApp** (#25D366 - hijau) → chat dengan pesan sapaan
  - **Instagram** → buka profil @vascode.creative
  - **Email** → compose email ke vascodecreative@gmail.com
- Informasi email tambahan di bagian bawah

### 4.7 Footer
- Logo + tagline
- Social links: Instagram, WhatsApp, Email
- Copyright dinamis (tahun otomatis)

### 4.8 Halaman 404 (Not Found)
- Animasi angka "404" dengan gradien
- Icon AlertCircle dengan efek pulse
- Glass card: pesan error, path yang dituju (dinamis)
- 2 tombol: "Return to Home" & "Go Back"
- *Floating background* orbs

### 4.9 Sistem Bilingual (EN/ID)
- Context provider (`LanguageContext`) menyediakan fungsi `t(key)`
- Semua teks statis menggunakan sistem terjemahan key-based
- Default: English
- Tombol toggle di navbar

---

## 5. Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Framework** | React 18.3 + TypeScript 5.8 |
| **Bundler** | Vite 5.4 |
| **Styling** | Tailwind CSS 3.4 + `tailwindcss-animate` |
| **UI Components** | shadcn/ui (Radix primitives) |
| **Animasi** | Framer Motion 12 |
| **Routing** | React Router 6 |
| **Data Fetching** | TanStack React Query 5 |
| **Icons** | Lucide React |
| **Form** | React Hook Form + Zod |
| **Deployment** | GitHub Pages + `gh-pages` |

---

## 6. Arsitektur & Struktur Proyek

```
src/
├── assets/              # Gambar logo (icon & full)
├── components/
│   ├── ui/              # shadcn/ui components (50+ komponen)
│   ├── Navbar.tsx       # Navigasi utama
│   ├── NavLink.tsx      # Link navigasi reusable
│   ├── Hero.tsx         # Hero section
│   ├── About.tsx        # About section
│   ├── Services.tsx     # Services grid
│   ├── Portfolio.tsx    # Portfolio grid + modal
│   ├── Contact.tsx      # Contact section
│   └── Footer.tsx       # Footer
├── contexts/
│   └── LanguageContext.tsx  # EN/ID translations + provider
├── hooks/
│   ├── use-toast.ts
│   └── use-mobile.tsx
├── lib/
│   └── utils.ts         # Utility functions (cn)
├── pages/
│   ├── Index.tsx        # Halaman utama (menggabungkan semua seksi)
│   └── NotFound.tsx     # Halaman 404
├── App.tsx              # Root component (React Query, Router)
├── main.tsx             # Entry point
├── index.css            # Global styles + Tailwind + brand tokens
└── vite-env.d.ts
```

---

## 7. Branding & Desain

### 7.1 Warna

| Token | HSL | Penggunaan |
|-------|-----|------------|
| `--void` | 240 3% 16% | Background utama (#28282B) |
| `--snow` | 0 0% 96% | Teks utama (#F5F5F4) |
| `--primary` | 257 65% 57% | Violet — aksen utama, tombol (#6C46E0) |
| `--secondary` / `--volt` | 77 100% 50% | Neon lime — aksen sekunder (#CCFF00) |

### 7.2 Tipografi
- **Font:** Jost (Google Fonts) — weight 300–800
- Hierarki: `<h1>` 4xl–8xl, `<h2>` 3xl–5xl, body text lg

### 7.3 Efek Visual
- Glassmorphism (`backdrop-blur-xl` + border transparan)
- Gradient text (`text-gradient`)
- Animated gradient orbs (blur-3xl dengan translate animation)
- Hover lift (`whileHover={{ y: -8 }}`)
- Scroll-triggered animations via `useInView`

---

## 8. Performa

| Metrik | Target |
|--------|--------|
| **Build Size** | ~200-400 KB (gzipped) |
| **Lighthouse Performance** | ≥ 85 |
| **Lighthouse Accessibility** | ≥ 90 |
| **First Contentful Paint** | < 1.5 detik |
| **Time to Interactive** | < 2 detik |

---

## 9. SEO & Metadata

- Title: "Vascode Creative | Creative Agency & Production House"
- Description: Kalimat deskriptif tentang layanan
- Open Graph: title, description, type, image
- Twitter Card: summary_large_image
- Canonical URL: `https://vascode.my.id`
- Robots.txt tersedia

---

## 10. Daftar Halaman & Route

| Route | Komponen | Deskripsi |
|-------|----------|-----------|
| `/` | `Index.tsx` | Halaman utama (Hero → About → Services → Portfolio → Contact → Footer) |
| `*` | `NotFound.tsx` | 404 — semua route tidak dikenal |

---

## 11. Dependensi Utama (Production)

react, react-dom, react-router-dom, @tanstack/react-query, framer-motion, tailwindcss-animate, lucide-react, class-variance-authority, clsx, tailwind-merge, date-fns, recharts, react-hook-form, @hookform/resolvers, zod, sonner, vaul, cmdk, input-otp, next-themes, embla-carousel-react, react-resizable-panels, react-day-picker, 30+ komponen @radix-ui

---

## 12. Strategi Deployment

```bash
npm run build        # Vite build
npm run deploy       # cp dist/404.html + gh-pages -d dist
```

Base URL diatur dinamis: `import.meta.env.PROD ? "/vascode-creative-showcase/" : "/"`

---

## 13. Batasan & Catatan

- **Tidak ada backend/database** — semua data (proyek portofolio) *hardcoded* di komponen.
- **Tidak ada sistem CMS** — perubahan konten memerlukan *deploy* ulang.
- **WhatsApp API** menggunakan `wa.me` link — tidak ada tracking atau analytic otomatis.
- **Form booking** tidak ada — semua lead melalui WhatsApp dengan templat pesan manual.
- **Single page** — SEO untuk halaman individual terbatas karena konten digabung dalam satu route.
- **Dark theme only** — tidak ada toggle light/dark mode (CSS variables diset untuk dark).

---

## 14. Future Enhancements (Opsional)

1. Integrasi backend/CMS (Strapi, Contentful, atau Sanity) untuk portofolio dinamis.
2. Form kontak dengan validasi & email notification.
3. Analytics (Google Analytics atau Plausible) untuk tracking konversi WhatsApp.
4. Lightbox gallery untuk portofolio foto.
5. Halaman layanan individual untuk SEO yang lebih baik.
6. Blog/artikel untuk *content marketing*.
7. Integrasi payment untuk pre-order layanan.
