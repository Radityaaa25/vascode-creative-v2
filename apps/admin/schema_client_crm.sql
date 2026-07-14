-- Tabel Client CRM (untuk halaman manajemen klien)
-- Terpisah dari tabel `clients` lama yang berisi project records

CREATE TABLE client_crm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT DEFAULT '',
  phone_wa TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Active',
  projects_count INTEGER DEFAULT 0,
  joined_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE client_crm ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access for client_crm" ON client_crm FOR ALL USING (true);

-- Dummy Data (bisa langsung dihapus via aplikasi atau SQL: DELETE FROM client_crm;)
INSERT INTO client_crm (name, company, email, phone_wa, status, projects_count, joined_at) VALUES
  ('Anggun Prameswari', 'PT Nusantara Kreatif', 'anggun@nusantara.co.id', '6281234567890', 'Active',   4, '2025-11-04'),
  ('Marco de Vries',     'Studio Fern',       'marco@studiofern.co',   '6281234567891', 'Pending',  1, '2026-01-12'),
  ('Sinta Wulandari',    'Kopi Kula',         'sinta@kopikula.id',     '6281234567892', 'Completed',7, '2024-08-21'),
  ('Rafi Hakim',         'Aurora Media',       'rafi@auroramedia.tv',   '6281234567893', 'Active',   3, '2025-06-30'),
  ('Elena Sørensen',     'Nord & Nord',        'elena@nordnord.dk',    '6281234567894', 'Active',   5, '2025-09-14'),
  ('Bagas Pratama',      'Rimba Threads',      'bagas@rimba.id',       '6281234567895', 'Pending',  1, '2026-02-02'),
  ('Kaia Whitfield',     'Bloom Botanicals',   'kaia@bloombot.co',     '6281234567896', 'Completed',6, '2024-04-19'),
  ('Dimas Ari',          'Loka Coffee',        'dimas@loka.coffee',    '6281234567897', 'Active',   2, '2025-12-08');
