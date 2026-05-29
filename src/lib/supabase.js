// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = 'https://rshbwueoscurgzfkouuh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzaGJ3dWVvc2N1cmd6ZmtvdXVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NDgzODEsImV4cCI6MjA5NTEyNDM4MX0.a-400qcSMm6U3jq-VUAKHco1KiJOVKCdl9fLIkHEK7o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getStorageUrl = (bucket, folder, filename) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(`${folder}/${filename}`)
  return data.publicUrl
}
