import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase URL or Service Role Key is missing from .env")
}

// Client ini menggunakan Service Role Key, artinya memiliki akses bypass RLS.
// HANYA GUNAKAN DI SERVER SIDE (Server Actions / Route Handlers)
// JANGAN PERNAH di-expose ke client component!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
