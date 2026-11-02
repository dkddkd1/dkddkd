import { createClient } from '@supabase/supabase-js'

// 실제 키는 개발 서버 프록시(vite.config.js)가 붙인다. 여기 키는 자리 채우기용
export const supabase = createClient(`${window.location.origin}/supabase`, 'local-proxy', {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
})
