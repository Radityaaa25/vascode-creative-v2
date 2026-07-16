-- Hapus tabel (hanya yang aman di-drop karena data default)
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS stats;
DROP TABLE IF EXISTS settings;

-- Tabel Portfolio / Projects
-- Menyimpan data proyek dengan dukungan 2 bahasa (ID & EN)
CREATE TABLE IF NOT EXISTS projects (
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
CREATE TABLE IF NOT EXISTS services (
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
CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label_id TEXT NOT NULL,
  label_en TEXT NOT NULL,
  value TEXT NOT NULL, -- e.g., '50+', '100%'
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Settings (Konfigurasi Global & Hero Section)
-- Menyimpan Hero text bilingual dan kontak (WA, IG, Email)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel FAQ (bilingual)
CREATE TABLE faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT NOT NULL,
  question_en TEXT NOT NULL,
  answer_id TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Cara Order Steps (bilingual + icon + title + description)
CREATE TABLE how_to_order_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_id TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'ArrowRight',
  step_number INTEGER NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Tools We Use
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Social Links (dinamis, admin bisa add/remove platform)
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  icon TEXT NOT NULL,
  url TEXT NOT NULL,
  label_id TEXT NOT NULL,
  label_en TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
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
  ('contact_instagram', 'vascode.creative', 'Username Instagram (tanpa @)'),
  -- Section Texts (Indonesia)
  ('services_title_id', 'Layanan Kami', 'Judul section Services (ID)'),
  ('services_subtitle_id', 'Yang Kami Kuasai', 'Subjudul section Services (ID)'),
  ('services_desc_id', 'Dari konsep hingga kreasi, kami memberikan solusi digital komprehensif sesuai kebutuhan Anda.', 'Deskripsi section Services (ID)'),
  ('portfolio_title_id', 'Karya Kami', 'Judul section Portfolio (ID)'),
  ('portfolio_subtitle_id', 'Proyek Unggulan', 'Subjudul section Portfolio (ID)'),
  ('portfolio_desc_id', 'Jelajahi karya terbaru kami dan lihat bagaimana kami membantu brand tampil beda.', 'Deskripsi section Portfolio (ID)'),
  ('contact_title_id', 'Hubungi Kami', 'Judul section Contact (ID)'),
  ('contact_subtitle_id', 'Mari Ciptakan Sesuatu yang Luar Biasa', 'Subjudul section Contact (ID)'),
  ('contact_desc_id', 'Siap memulai proyek Anda? Kami senang mendengar dari Anda. Hubungi kami melalui WhatsApp atau Instagram.', 'Deskripsi section Contact (ID)'),
  ('cta_book_id', 'Pesan Sekarang', 'Tombol CTA Book Now (ID)'),
  ('howtoorder_title_id', 'Cara Order', 'Judul section Cara Order (ID)'),
  ('faq_title_id', 'FAQ', 'Judul section FAQ (ID)'),
  -- Section Texts (English)
  ('services_title_en', 'Our Services', 'Judul section Services (EN)'),
  ('services_subtitle_en', 'What We Do Best', 'Subjudul section Services (EN)'),
  ('services_desc_en', 'From concept to creation, we deliver comprehensive digital solutions tailored to your needs.', 'Deskripsi section Services (EN)'),
  ('portfolio_title_en', 'Our Works', 'Judul section Portfolio (EN)'),
  ('portfolio_subtitle_en', 'Featured Projects', 'Subjudul section Portfolio (EN)'),
  ('portfolio_desc_en', 'Explore our latest works and see how we help brands stand out.', 'Deskripsi section Portfolio (EN)'),
  ('contact_title_en', 'Contact Us', 'Judul section Contact (EN)'),
  ('contact_subtitle_en', 'Let''s Create Something Amazing', 'Subjudul section Contact (EN)'),
  ('contact_desc_en', 'Ready to start your project? We''d love to hear from you. Reach out through WhatsApp or Instagram.', 'Deskripsi section Contact (EN)'),
  ('cta_book_en', 'Book Now', 'Tombol CTA Book Now (EN)'),
  ('howtoorder_title_en', 'How to Order', 'Judul section Cara Order (EN)'),
  ('faq_title_en', 'FAQ', 'Judul section FAQ (EN)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO stats (label_id, label_en, value, order_index) VALUES 
  ('Proyek Selesai', 'Projects Completed', '50+', 1),
  ('Klien Puas', 'Happy Clients', '30+', 2),
  ('Tingkat Kepuasan', 'Satisfaction Rate', '100%', 3);

INSERT INTO faq (question_id, question_en, answer_id, answer_en, order_index) VALUES
  ('Bagaimana cara memesan layanan?', 'How do I order a service?', 'Anda bisa melihat portofolio kami, pilih layanan yang diinginkan, lalu klik tombol "Pesan Sekarang" untuk terhubung dengan kami via WhatsApp. Tim kami akan merespon dengan cepat!', 'Browse our portfolio, choose a service, and click "Book Now" to connect with us via WhatsApp. Our team will respond promptly!', 0),
  ('Berapa lama proses pengerjaan?', 'How long does it take?', 'Waktu pengerjaan bervariasi tergantung kompleksitas proyek. Untuk website biasanya 1-2 minggu, untuk video 3-7 hari, dan desain 1-3 hari. Diskusikan dengan kami untuk estimasi yang lebih akurat.', 'Timeline depends on project complexity. Websites typically take 1-2 weeks, videos 3-7 days, and designs 1-3 days. Discuss with us for a more accurate estimate.', 1),
  ('Apakah bisa revisi?', 'Can I request revisions?', 'Tentu saja! Kami menyediakan revisi untuk memastikan hasil akhir sesuai dengan keinginan Anda. Jumlah revisi akan disepakati di awal diskusi.', 'Absolutely! We provide revisions to ensure the final result matches your expectations. The number of revisions will be agreed upon at the start.', 2),
  ('Bagaimana sistem pembayarannya?', 'What is the payment system?', 'Kami menerapkan sistem pembayaran 50% di awal sebagai DP dan 50% setelah proyek selesai. Metode pembayaran bisa melalui transfer bank, E-Wallet, atau QRIS.', 'We apply a 50% upfront payment as DP and 50% upon project completion. Payment methods include bank transfer, E-Wallet, or QRIS.', 3),
  ('Apakah ada garansi?', 'Is there a warranty?', 'Ya, kami memberikan garansi kepuasan. Jika hasil belum sesuai, kami akan melakukan perbaikan hingga Anda puas. Kepuasan klien adalah prioritas utama kami.', 'Yes, we provide a satisfaction guarantee. If the results are not as expected, we will make improvements until you are satisfied. Client satisfaction is our top priority.', 4);

INSERT INTO tools (name, logo_url, order_index) VALUES
  ('Canva', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg', 0),
  ('CapCut', 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/capcut-icon.svg', 1),
  ('VSCode', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', 2),
  ('Antigravity', 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png', 3),
  ('Adobe Illustrator', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg', 4),
  ('After Effects', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg', 5),
  ('Adobe Premiere', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-original.svg', 6);


-- Aktifkan Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE how_to_order_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Buat Policy: Semua orang (anonim/frontend) bisa BACA (SELECT)
CREATE POLICY "Public read access for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access for services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read access for stats" ON stats FOR SELECT USING (true);
CREATE POLICY "Public read access for settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public read access for faq" ON faq FOR SELECT USING (true);
CREATE POLICY "Public read access for how_to_order_steps" ON how_to_order_steps FOR SELECT USING (true);
CREATE POLICY "Public read access for social_links" ON social_links FOR SELECT USING (true);
CREATE POLICY "Public read access for tools" ON tools FOR SELECT USING (true);

-- Default data for Cara Order
INSERT INTO how_to_order_steps (title_id, title_en, description_id, description_en, icon, step_number, order_index) VALUES
  ('Lihat Portofolio', 'Browse Portfolio', 'Jelajahi hasil proyek yang telah kami selesaikan untuk melihat langsung kualitas dan gaya karya kami.', 'Explore our completed projects to see the quality and style of our work firsthand.', 'Eye', 1, 1),
  ('Pilih Layanan', 'Choose Service', 'Tentukan layanan yang sesuai dengan kebutuhan Anda, mulai dari Website, Video, Desain hingga Editing.', 'Select the service that fits your needs, from Websites, Video, Design to Editing.', 'Layout', 2, 2),
  ('Pesan Sekarang', 'Book Now', 'Klik tombol "Pesan Sekarang" untuk memulai diskusi dengan tim kami melalui WhatsApp.', 'Click the "Book Now" button to start a discussion with our team via WhatsApp.', 'MessageCircle', 3, 3),
  ('Dialihkan ke WhatsApp', 'Redirected to WhatsApp', 'Anda akan otomatis dialihkan ke WhatsApp dengan template pesan yang sudah kami siapkan.', 'You will be automatically redirected to WhatsApp with a pre-filled message template.', 'ExternalLink', 4, 4),
  ('Lengkapi Data', 'Fill In Details', 'Isi data-data yang diperlukan agar kami bisa memahami kebutuhan dan keinginan Anda.', 'Fill in the required details so we can understand your needs and preferences.', 'FileText', 5, 5),
  ('Diskusi & Kesepakatan', 'Discuss & Agree', 'Diskusikan harga, jadwal, lokasi, dan detail layanan lainnya langsung dengan tim kami.', 'Discuss pricing, schedule, location, and other service details directly with our team.', 'MessageSquare', 6, 6),
  ('Lakukan Pembayaran', 'Make Payment', 'Lakukan pembayaran sesuai dengan kesepakatan yang telah didiskusikan sebelumnya.', 'Make the payment according to the agreement that was discussed earlier.', 'CreditCard', 7, 7),
  ('Proses Pengerjaan', 'Production Process', 'Tim kami akan mulai mengerjakan proyek Anda dengan penuh dedikasi dan perhatian pada detail.', 'Our team will start working on your project with full dedication and attention to detail.', 'Settings', 8, 8),
  ('Terima Hasil', 'Receive Results', 'Hasil proyek akan dikirimkan kepada Anda untuk direview dan diberikan masukan.', 'The project results will be sent to you for review and feedback.', 'CheckCircle2', 9, 9),
  ('Selesai!', 'Done!', 'Proyek selesai. Mudah bukan? Nikmati hasil karya terbaik dari Vascode Creative.', 'Project completed. Easy, right? Enjoy the best work from Vascode Creative.', 'Sparkles', 10, 10);

-- Default social links
INSERT INTO social_links (platform, icon, url, label_id, label_en, order_index) VALUES
  ('Instagram', 'Instagram', 'https://www.instagram.com/vascode.creative', 'Ikuti Instagram Kami', 'Follow Our Instagram', 1),
  ('WhatsApp', 'MessageCircle', 'https://wa.me/6281234567890', 'Chat WhatsApp', 'Chat on WhatsApp', 2),
  ('Email', 'Mail', 'mailto:vascodecreative@gmail.com', 'Kirim Email', 'Send Email', 3);

-- Tabel log aktivitas admin
CREATE TABLE IF NOT EXISTS admin_logs (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Catatan:
-- Akses UPDATE/INSERT/DELETE hanya bisa dilakukan jika menggunakan SUPABASE_SERVICE_ROLE_KEY
-- yang mana hanya akan kita gunakan di backend (halaman admin) agar aman.
