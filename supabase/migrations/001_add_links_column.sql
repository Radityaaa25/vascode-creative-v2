-- Add `links` column to projects table for multiple project links
ALTER TABLE projects ADD COLUMN IF NOT EXISTS links JSONB DEFAULT NULL;

-- Migrate existing project_url values into links array
UPDATE projects
SET links = jsonb_build_array(jsonb_build_object('label', 'Lihat Proyek', 'url', project_url))
WHERE project_url IS NOT NULL AND links IS NULL;
