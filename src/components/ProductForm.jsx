import { useState } from 'react'
import { CAUTION_TYPES, PERIOD_UNITS, PLACES, STAGES, UNITS } from '../constants'

const EMPTY_PRODUCT = {
  product_id: '',
  name: '',
  amount: '',
  unit: 'g',
  quantity: '',
  price: '',
  description: '',
  source_file: '',
}
const NEW_ROW = {
  ingredients: () => ({ ingredient: '', origin: '' }),
  storage: () => ({ stage: '수령 후', place: '', period_value: '', period_unit: '일', method: '' }),
  cautions: () => ({ type: '보관주의', content: '' }),
}

const isWholeNumber = (v) => /^\d+$/.test(String(v).trim())
const orNull = (v) => (v.trim() === '' ? null : v.trim())

export default function ProductForm({ existingIds, onSubmit, onCancel }) {
  const [product, setProduct] = useState(EMPTY_PRODUCT)
  const [rows, setRows] = useState({ ingredients: [], storage: [], cautions: [] })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const setField = (key) => (e) => setProduct({ ...product, [key]: e.target.value })
  const addRow = (group) => setRows({ ...rows, [group]: [...rows[group], NEW_ROW[group]()] })
  const removeRow = (group, idx) =>
    setRows({ ...rows, [group]: rows[group].filter((_, i) => i !== idx) })
  const setRowField = (group, idx, key) => (e) =>
    setRows({
      ...rows,
      [group]: rows[group].map((r, i) => (i === idx ? { ...r, [key]: e.target.value } : r)),
    })

  function validate() {
    const id = product.product_id.trim()
    if (!/^P-\d{4}$/.test(id)) return '상품코드는 P-0000 형식이어야 합니다'
    if (existingIds.includes(id)) return '이미 있는 상품코드입니다'
    if (!product.name.trim()) return '상품명을 입력하세요'
    if (!isWholeNumber(product.amount) || Number(product.amount) <= 0) return '용량은 1 이상의 정수로 입력하세요'
    if (!product.quantity.trim()) return '수량을 입력하세요 (예: 1봉, 10개)'
    if (!isWholeNumber(product.price)) return '가격은 0 이상의 정수로 입력하세요'
    if (!product.description.trim()) return '설명을 입력하세요'
    if (rows.ingredients.some((r) => !r.ingredient.trim())) return '원재료 이름이 빈 줄이 있습니다'
    if (rows.storage.some((r) => !isWholeNumber(r.period_value))) return '보관 기간은 0 이상의 정수로 입력하세요 (당일은 0일)'
    if (rows.cautions.some((r) => !r.content.trim())) return '주의사항 내용이 빈 줄이 있습니다'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const message = validate()
    if (message) {
      setError(message)
      return
    }
    setError('')
    setSaving(true)
    try {
      await onSubmit(
        {
          product_id: product.product_id.trim(),
          name: product.name.trim(),
          amount: Number(product.amount),
          unit: product.unit,
          quantity: product.quantity.trim(),
          price: Number(product.price),
          description: product.description.trim(),
          source_file: product.source_file.trim(), // DB 가 not null 이라 없으면 빈 문자열
        },
        rows.ingredients.map((r) => ({ ingredient: r.ingredient.trim(), origin: orNull(r.origin) })),
        rows.storage.map((r) => ({
          stage: r.stage,
          place: r.place || null,
          period_value: Number(r.period_value),
          period_unit: r.period_unit,
          method: orNull(r.method),
        })),
        rows.cautions.map((r) => ({ type: r.type, content: r.content.trim() })),
      )
    } catch (err) {
      setError(`저장 실패: ${err.message}`)
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>상품 추가</h2>

        <div className="grid">
          <label>상품코드 *<input value={product.product_id} onChange={setField('product_id')} placeholder="P-0500" /></label>
          <label>상품명 *<input value={product.name} onChange={setField('name')} /></label>
          <label>용량 *<input value={product.amount} onChange={setField('amount')} inputMode="numeric" /></label>
          <label>단위 *
            <select value={product.unit} onChange={setField('unit')}>
              {UNITS.map((u) => <option key={u}>{u}</option>)}
            </select>
          </label>
          <label>수량 *<input value={product.quantity} onChange={setField('quantity')} placeholder="1봉, 10개" /></label>
          <label>가격(원) *<input value={product.price} onChange={setField('price')} inputMode="numeric" /></label>
          <label className="wide">설명 *<input value={product.description} onChange={setField('description')} /></label>
          <label className="wide">출처 문서<input value={product.source_file} onChange={setField('source_file')} placeholder="없으면 비워 두기" /></label>
        </div>

        <RowSection title="원재료" onAdd={() => addRow('ingredients')}>
          {rows.ingredients.map((r, i) => (
            <div className="row" key={i}>
              <input placeholder="원재료 *" value={r.ingredient} onChange={setRowField('ingredients', i, 'ingredient')} />
              <input placeholder="원산지 (모르면 비워 두기)" value={r.origin} onChange={setRowField('ingredients', i, 'origin')} />
              <button type="button" onClick={() => removeRow('ingredients', i)}>✕</button>
            </div>
          ))}
        </RowSection>

        <RowSection title="보관" onAdd={() => addRow('storage')}>
          {rows.storage.map((r, i) => (
            <div className="row" key={i}>
              <select value={r.stage} onChange={setRowField('storage', i, 'stage')}>
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <select value={r.place} onChange={setRowField('storage', i, 'place')}>
                <option value="">장소 미표기</option>
                {PLACES.map((p) => <option key={p}>{p}</option>)}
              </select>
              <input className="short" placeholder="기간 *" value={r.period_value} onChange={setRowField('storage', i, 'period_value')} inputMode="numeric" />
              <select value={r.period_unit} onChange={setRowField('storage', i, 'period_unit')}>
                {PERIOD_UNITS.map((u) => <option key={u}>{u}</option>)}
              </select>
              <input placeholder="방법" value={r.method} onChange={setRowField('storage', i, 'method')} />
              <button type="button" onClick={() => removeRow('storage', i)}>✕</button>
            </div>
          ))}
        </RowSection>

        <RowSection title="주의사항" onAdd={() => addRow('cautions')}>
          {rows.cautions.map((r, i) => (
            <div className="row" key={i}>
              <select value={r.type} onChange={setRowField('cautions', i, 'type')}>
                {CAUTION_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <input placeholder="내용 *" value={r.content} onChange={setRowField('cautions', i, 'content')} />
              <button type="button" onClick={() => removeRow('cautions', i)}>✕</button>
            </div>
          ))}
        </RowSection>

        {error && <p className="error">{error}</p>}

        <div className="actions">
          <button type="button" onClick={onCancel} disabled={saving}>취소</button>
          <button type="submit" className="primary" disabled={saving}>{saving ? '저장 중…' : '저장'}</button>
        </div>
      </form>
    </div>
  )
}

function RowSection({ title, onAdd, children }) {
  return (
    <fieldset>
      <legend>{title}</legend>
      {children}
      <button type="button" className="link" onClick={onAdd}>+ {title} 줄 추가</button>
    </fieldset>
  )
}
