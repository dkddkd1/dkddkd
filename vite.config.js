import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // 로컬 개발 서버는 내 PC 에서만 접속 가능
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
})
