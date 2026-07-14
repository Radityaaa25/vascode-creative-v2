-- Tabel Clients (Untuk Pendataan / CRM Admin)
-- Data ini dipakai untuk generate grafik dan laporan PDF/Excel
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  status TEXT NOT NULL, -- e.g., 'On Progress', 'Completed', 'Cancelled'
  project_value NUMERIC, -- Nilai proyek (opsional, untuk hitung revenue)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Dummy Data untuk testing Chart & Laporan
INSERT INTO clients (client_name, project_name, start_date, status, project_value) VALUES 
  ('PT Maju Bersama', 'Company Profile Website', '2023-10-01', 'Completed', 15000000),
  ('Toko Baju Kekinian', 'Tiktok Video Ads', '2023-11-15', 'Completed', 5000000),
  ('Cafe Senja', 'Social Media Management', '2024-01-10', 'On Progress', 8000000),
  ('Startup Fintech XYZ', 'Mobile App UI/UX Design', '2024-02-05', 'On Progress', 25000000);

-- Aktifkan Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Buat Policy: Hanya Service Role (Admin) yang bisa akses & ubah data klien
-- (Anonim/Frontend TIDAK boleh melihat data klien ini)
CREATE POLICY "Admin full access for clients" ON clients FOR ALL USING (true);
