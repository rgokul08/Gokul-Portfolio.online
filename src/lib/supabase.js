// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getStorageUrl = (bucket, folder, filename) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(`${folder}/${filename}`)
  return data.publicUrl
}
