import { useEffect, useState } from 'react'
import { configError, supabase } from './supabase'
import Login from './components/Login'
import ProductManager from './ProductManager'

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = 로그인 상태 확인 중

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  if (configError) {
    return (
      <div className="center">
        <p className="error">{configError}</p>
      </div>
    )
  }
  if (session === undefined) return <div className="center muted">확인 중…</div>
  if (!session) return <Login />

  return <ProductManager email={session.user.email} onLogout={() => supabase.auth.signOut()} />
}
