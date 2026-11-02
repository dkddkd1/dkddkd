import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? '이메일 또는 비밀번호가 틀렸습니다'
          : `로그인 실패: ${authError.message}`,
      )
      setBusy(false)
    }
    // 성공하면 App 이 로그인 상태 변화를 받아 화면을 바꾼다
  }

  return (
    <div className="center">
      <form className="login" onSubmit={handleSubmit}>
        <h1>상품 관리</h1>
        <label>
          이메일
          <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="primary" disabled={busy}>{busy ? '로그인 중…' : '로그인'}</button>
      </form>
    </div>
  )
}
