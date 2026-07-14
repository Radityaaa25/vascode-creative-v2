import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client ini punya akses FULL ke semua data, bypass RLS.
// HANYA BOLEH DIGUNAKAN DI DALAM SERVER ACTIONS ATAU ROUTE HANDLERS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
