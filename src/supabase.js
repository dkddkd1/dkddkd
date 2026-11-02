import { createClient } from '@supabase/supabase-js'

// anon 키는 브라우저에 공개되어도 되는 키. 쓰기 권한은 RLS 정책(관리자 로그인)으로 막는다
// service_role 키는 RLS 를 무시하므로 브라우저(VITE_ 변수)에 절대 넣지 않는다
const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

function makeClient() {
  if (!rawUrl || !key) {
    return [null, '환경 변수 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 가 설정되지 않았습니다']
  }
  try {
    // 대시보드에서 .../rest/v1/ 까지 복사해도 되도록 주소 부분만 쓴다
    return [createClient(new URL(rawUrl).origin, key), '']
  } catch {
    return [null, `VITE_SUPABASE_URL 형식이 잘못되었습니다: ${rawUrl}`]
  }
}

export const [supabase, configError] = makeClient()
