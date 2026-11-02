import { configError } from './supabase'
import ProductManager from './ProductManager'

// 로그인 없이 바로 상품 관리 화면을 연다 (추가 · 삭제 권한은 supabase_public_write.sql 의 RLS 정책)
export default function App() {
  if (configError) {
    return (
      <div className="center">
        <p className="error">{configError}</p>
      </div>
    )
  }
  return <ProductManager />
}
