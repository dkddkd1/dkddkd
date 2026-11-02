export default function ProductDetail({ product: p, onDelete }) {
  return (
    <div className="detail">
      <div className="detail-head">
        <h2>
          {p.name} <span className="muted">{p.product_id}</span>
        </h2>
        <button className="danger" onClick={onDelete}>삭제</button>
      </div>

      <dl className="fields">
        <dt>용량</dt>
        <dd>{p.amount.toLocaleString()}{p.unit} · {p.quantity}</dd>
        <dt>가격</dt>
        <dd>{p.price.toLocaleString()}원</dd>
        <dt>설명</dt>
        <dd>{p.description}</dd>
        <dt>출처 문서</dt>
        <dd>{p.source_file || '-'}</dd>
      </dl>

      <h3>원재료</h3>
      {p.ingredients.length === 0 ? (
        <p className="muted">없음</p>
      ) : (
        <table className="sub">
          <thead>
            <tr><th>원재료</th><th>원산지</th></tr>
          </thead>
          <tbody>
            {p.ingredients.map((i, idx) => (
              <tr key={idx}>
                <td>{i.ingredient}</td>
                <td>{i.origin ?? <span className="muted">미표기</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>보관</h3>
      {p.storage.length === 0 ? (
        <p className="muted">없음</p>
      ) : (
        <table className="sub">
          <thead>
            <tr><th>시점</th><th>장소</th><th>기간</th><th>방법</th></tr>
          </thead>
          <tbody>
            {p.storage.map((s, idx) => (
              <tr key={idx}>
                <td>{s.stage}</td>
                <td>{s.place ?? <span className="muted">미표기</span>}</td>
                <td>{s.period === '0일' ? '당일' : s.period}</td>
                <td>{s.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>주의사항</h3>
      {p.cautions.length === 0 ? (
        <p className="muted">없음</p>
      ) : (
        <table className="sub">
          <thead>
            <tr><th>유형</th><th>내용</th></tr>
          </thead>
          <tbody>
            {p.cautions.map((c, idx) => (
              <tr key={idx}>
                <td className="nowrap">{c.type}</td>
                <td>{c.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
