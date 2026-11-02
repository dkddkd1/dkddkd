// 알레르기 행 중 '없음', '글루텐 없음', '미확인' 은 유발물질이 아님 (query_allergy_products.sql 과 같은 기준)
export function allergensOf(product) {
  return product.cautions
    .filter((c) => c.type === '알레르기')
    .map((c) => c.content.trim())
    .filter((text) => !text.endsWith('없음') && text !== '미확인')
}

export function crossContactsOf(product) {
  return product.cautions.filter((c) => c.type === '교차오염').map((c) => c.content)
}

// 상품코드 · 상품명 · 설명 · 원재료 · 원산지 · 보관 방법 · 주의사항 내용에서 검색
function searchableText(product) {
  return [
    product.product_id,
    product.name,
    product.description,
    ...product.ingredients.flatMap((i) => [i.ingredient, i.origin]),
    ...product.storage.map((s) => s.method),
    ...product.cautions.map((c) => c.content),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function filterProducts(products, query, mode) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return products.filter((p) => {
    if (mode === 'allergen' && allergensOf(p).length === 0) return false
    if (mode === 'cross' && crossContactsOf(p).length === 0) return false
    const text = searchableText(p)
    return words.every((w) => text.includes(w))
  })
}
