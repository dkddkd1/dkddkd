import { useCallback, useEffect, useMemo, useState } from 'react'
import { createProduct, deleteProduct, fetchProducts } from './api'
import { filterProducts } from './filters'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import ProductForm from './components/ProductForm'

export default function ProductManager({ email, onLogout }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('all') // all | allergen | cross
  const [selectedId, setSelectedId] = useState(null)
  const [adding, setAdding] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setProducts(await fetchProducts())
    } catch (e) {
      setError(`불러오기 실패: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const visible = useMemo(() => filterProducts(products, query, mode), [products, query, mode])
  const selected = products.find((p) => p.product_id === selectedId) ?? null

  async function handleCreate(product, ingredients, storage, cautions) {
    await createProduct(product, ingredients, storage, cautions) // 실패하면 폼이 오류를 보여줌
    setAdding(false)
    await load()
    setSelectedId(product.product_id)
  }

  async function handleDelete(product) {
    const ok = window.confirm(
      `${product.name} (${product.product_id}) 을(를) 삭제할까요?\n원재료 · 보관 · 주의사항도 함께 삭제되며 되돌릴 수 없습니다.`,
    )
    if (!ok) return
    try {
      await deleteProduct(product.product_id)
      setSelectedId(null)
      await load()
    } catch (e) {
      setError(`삭제 실패: ${e.message}`)
    }
  }

  return (
    <div className="app">
      <header className="toolbar">
        <h1>상품 관리</h1>
        <input
          type="search"
          placeholder="상품명 · 코드 · 원재료 · 원산지 · 주의사항 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="all">전체</option>
          <option value="allergen">알레르기 유발물질 있음</option>
          <option value="cross">교차오염 주의 있음</option>
        </select>
        <button onClick={load} disabled={loading}>새로고침</button>
        <button className="primary" onClick={() => setAdding(true)}>+ 상품 추가</button>
        <span className="muted user">{email}</span>
        <button onClick={onLogout}>로그아웃</button>
      </header>

      {error && <p className="error">{error}</p>}

      <main className="layout">
        <section className="panel">
          <p className="muted">
            {loading ? '불러오는 중…' : `${visible.length}개 / 전체 ${products.length}개`}
          </p>
          <ProductList products={visible} selectedId={selectedId} onSelect={setSelectedId} />
        </section>
        <section className="panel">
          {selected ? (
            <ProductDetail product={selected} onDelete={() => handleDelete(selected)} />
          ) : (
            <p className="muted">왼쪽 목록에서 상품을 선택하세요</p>
          )}
        </section>
      </main>

      {adding && (
        <ProductForm
          existingIds={products.map((p) => p.product_id)}
          onSubmit={handleCreate}
          onCancel={() => setAdding(false)}
        />
      )}
    </div>
  )
}
