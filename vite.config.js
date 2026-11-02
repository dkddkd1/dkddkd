import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// 브라우저는 /supabase 로 요청하고, 개발 서버가 키를 붙여 Supabase 로 전달한다.
// 키는 VITE_ 접두사가 없어 브라우저 번들에 들어가지 않는다.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const key = env.SUPABASE_SECRET_KEY?.trim()
  if (!env.SUPABASE_URL || !key) {
    throw new Error('.env.local 에 SUPABASE_URL, SUPABASE_SECRET_KEY 를 설정하세요 (.env.example 참고)')
  }
  // 대시보드에서 .../rest/v1/ 까지 복사해도 되도록 주소 부분만 쓴다
  const url = new URL(env.SUPABASE_URL.trim()).origin

  return {
    plugins: [react()],
    server: {
      // 내 PC 에서만 접속 가능
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      proxy: {
        '/supabase': {
          target: url,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/supabase/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('apikey', key)
              // 예전 service_role 키(JWT)는 Authorization 에도 넣고, 새 sb_secret_ 키는 apikey 만 보낸다
              if (key.startsWith('sb_')) proxyReq.removeHeader('authorization')
              else proxyReq.setHeader('authorization', `Bearer ${key}`)
              // secret 키는 브라우저 요청이면 거부되므로 브라우저 흔적을 지운다
              for (const name of proxyReq.getHeaderNames()) {
                if (name.startsWith('sec-') || name === 'origin' || name === 'referer') {
                  proxyReq.removeHeader(name)
                }
              }
              proxyReq.setHeader('user-agent', 'product-admin-local-proxy')
            })
          },
        },
      },
    },
  }
})
