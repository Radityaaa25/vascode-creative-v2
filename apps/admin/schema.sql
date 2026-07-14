-- Hapus tabel jika sudah ada (hati-hati di production!)
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS stats;
DROP TABLE IF EXISTS settings;

-- Tabel Portfolio / Projects
-- Menyimpan data proyek dengan dukungan 2 bahasa (ID & EN)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Semua', 'Website', 'Foto/Video', 'Desain', 'Lainnya'
  description_id TEXT NOT NULL,
  description_en TEXT NOT NULL,
  image_url TEXT,
  tech_stack TEXT, -- Opsional: misal "React, Tailwind, Node.js"
  project_url TEXT, -- Link demo/hasil
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Services
-- Menyimpan data layanan, icon, dan template pesan WA bilingual
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  icon TEXT NOT NULL, -- Nama ikon dari Lucide React (misal: 'Monitor', 'Camera', 'PenTool')
  description_id TEXT NOT NULL,
  description_en TEXT NOT NULL,
  wa_template_id TEXT NOT NULL, -- Template WA bahasa Indonesia
  wa_template_en TEXT NOT NULL, -- Template WA bahasa Inggris
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Stats (Statistik Tentang Kami)
-- Untuk "Proyek Selesai 50+", dll.
CREATE TABLE stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label_id TEXT NOT NULL,
  label_en TEXT NOT NULL,
  value TEXT NOT NULL, -- e.g., '50+', '100%'
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Settings (Konfigurasi Global & Hero Section)
-- Menyimpan Hero text bilingual dan kontak (WA, IG, Email)
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Data Awal (Dummy & Default Setup)
INSERT INTO settings (key, value, description) VALUES 
  -- Hero Section (Indonesia)
  ('hero_title_id', 'Kami Ciptakan Keunggulan Digital', 'Judul utama di Hero (ID)'),
  ('hero_desc_id', 'Transformasi brand Anda dengan website memukau, konten video memikat, dan desain kreatif yang berdampak.', 'Deskripsi di Hero (ID)'),
  -- Hero Section (English)
  ('hero_title_en', 'We Craft Digital Excellence', 'Judul utama di Hero (EN)'),
  ('hero_desc_en', 'Transform your brand with stunning websites, captivating video content, and impactful creative designs.', 'Deskripsi di Hero (EN)'),
  -- Hero CTA
  ('hero_cta1_id', 'Mulai Proyek Anda', 'CTA utama (ID)'),
  ('hero_cta1_en', 'Start Your Project', 'CTA utama (EN)'),
  ('hero_cta2_id', 'Lihat Karya Kami', 'CTA kedua (ID)'),
  ('hero_cta2_en', 'View Our Work', 'CTA kedua (EN)'),
  -- Kontak & Social Media
  ('contact_whatsapp', '+6281234567890', 'Nomor WhatsApp Utama (tanpa +)'),
  ('contact_email', 'vascodecreative@gmail.com', 'Alamat Email Utama'),
  ('contact_instagram', 'vascode.creative', 'Username Instagram (tanpa @)');

INSERT INTO stats (label_id, label_en, value, order_index) VALUES 
  ('Proyek Selesai', 'Projects Completed', '50+', 1),
  ('Klien Puas', 'Happy Clients', '30+', 2),
  ('Tingkat Kepuasan', 'Satisfaction Rate', '100%', 3);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Buat Policy: Semua orang (anonim/frontend) bisa BACA (SELECT)
CREATE POLICY "Public read access for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access for services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read access for stats" ON stats FOR SELECT USING (true);
CREATE POLICY "Public read access for settings" ON settings FOR SELECT USING (true);

-- Catatan:
-- Akses UPDATE/INSERT/DELETE hanya bisa dilakukan jika menggunakan SUPABASE_SERVICE_ROLE_KEY
-- yang mana hanya akan kita gunakan di backend (halaman admin) agar aman.
