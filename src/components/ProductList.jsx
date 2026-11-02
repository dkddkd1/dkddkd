import { allergensOf, crossContactsOf } from '../filters'

export default function ProductList({ products, selectedId, onSelect }) {
  if (products.length === 0) return <p className="muted">조건에 맞는 상품이 없습니다</p>

  return (
    <table className="list">
      <thead>
        <tr>
          <th>코드</th>
          <th>상품명</th>
          <th className="num">용량</th>
          <th className="num">가격</th>
          <th>주의</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr
            key={p.product_id}
            className={p.product_id === selectedId ? 'selected' : ''}
            onClick={() => onSelect(p.product_id)}
          >
            <td>{p.product_id}</td>
            <td>{p.name}</td>
            <td className="num">{p.amount.toLocaleString()}{p.unit}</td>
            <td className="num">{p.price.toLocaleString()}원</td>
            <td>
              {allergensOf(p).length > 0 && <span className="badge red">알레르기</span>}
              {crossContactsOf(p).length > 0 && <span className="badge orange">교차오염</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
