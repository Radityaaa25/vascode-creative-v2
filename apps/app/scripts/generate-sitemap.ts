import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''
const BASE_URL = 'https://vascodecreative.com'

async function generateSitemap() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const { data: settings } = await supabase.from('settings').select('value').eq('key', 'portfolio_categories').single()

  const categories: { name: string }[] = settings?.value || []
  const urls: string[] = ['', ...categories.map((c) => `/portfolio/${encodeURIComponent(c.name.toLowerCase())}`)]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${BASE_URL}${u}</loc><changefreq>monthly</changefreq><priority>${u === '' ? '1.0' : '0.8'}</priority></url>`).join('\n')}
</urlset>`

  fs.writeFileSync(path.resolve('public/sitemap.xml'), sitemap, 'utf-8')
  console.log('sitemap.xml generated')
}

generateSitemap().catch(console.error)
