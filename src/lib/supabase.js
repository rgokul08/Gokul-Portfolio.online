// src/lib/supabase.js
// Supabase client configuration
// Replace VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper: Get public image URL from Supabase Storage
export const getStorageUrl = (bucket, folder, filename) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(`${folder}/${filename}`)
  return data.publicUrl
}
