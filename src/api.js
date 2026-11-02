import { supabase } from './supabase'

// Supabase 오류를 읽기 쉬운 메시지로 바꾼다
function toError(error) {
  if (error.code === '23505') return new Error('이미 있는 상품코드입니다')
  if (error.code === '23514') return new Error(`허용되지 않는 값이 있습니다 (${error.message})`)
  // 연결 실패 등은 message 가 비어 있을 수 있어 다른 필드도 확인한다
  const text = [error.message, error.details, error.hint].filter((v) => typeof v === 'string' && v).join(' / ')
  return new Error(text || 'Supabase 연결 실패 (.env.local 의 URL · 키 확인)')
}

// 상품 + 원재료 · 보관 · 주의사항 (products_full 뷰)
export async function fetchProducts() {
  const { data, error } = await supabase.from('products_full').select('*').order('product_id')
  if (error) throw toError(error)
  return data
}

// 상품을 먼저 넣고 하위 데이터를 넣는다. 하위 데이터가 실패하면 상품을 지워 되돌린다
export async function createProduct(product, ingredients, storage, cautions) {
  const { error } = await supabase.from('products').insert(product)
  if (error) throw toError(error)

  const withId = (rows) => rows.map((row) => ({ ...row, product_id: product.product_id }))
  const children = [
    ['product_ingredients', ingredients],
    ['product_storage', storage],
    ['product_cautions', cautions],
  ]
  try {
    for (const [table, rows] of children) {
      if (rows.length === 0) continue
      const { error: childError } = await supabase.from(table).insert(withId(rows))
      if (childError) throw toError(childError)
    }
  } catch (e) {
    // on delete cascade 로 이미 들어간 하위 데이터도 함께 지워진다
    await supabase.from('products').delete().eq('product_id', product.product_id)
    throw e
  }
}

export async function deleteProduct(productId) {
  const { error } = await supabase.from('products').delete().eq('product_id', productId)
  if (error) throw toError(error)
}
