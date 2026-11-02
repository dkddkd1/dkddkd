import { createClient } from '@supabase/supabase-js'

// publishable(anon) 키는 브라우저에 공개되어도 되는 키. 쓰기 권한은 RLS 정책(관리자 로그인)으로 막는다
const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

function makeClient() {
  if (!rawUrl || !key) {
    return [null, '환경 변수 VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY 가 설정되지 않았습니다']
  }
  try {
    // 대시보드에서 .../rest/v1/ 까지 복사해도 되도록 주소 부분만 쓴다
    return [createClient(new URL(rawUrl).origin, key), '']
  } catch {
    return [null, `VITE_SUPABASE_URL 형식이 잘못되었습니다: ${rawUrl}`]
  }
}

export const [supabase, configError] = makeClient()
