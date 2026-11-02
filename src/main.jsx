import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './App.css'

// 화면이 하얗게 비지 않도록, 오류가 나면 내용을 화면에 보여준다
function showFatal(message) {
  const root = document.getElementById('root')
  if (!root) return
  root.innerHTML = ''
  const box = document.createElement('pre')
  box.className = 'error'
  box.style.margin = '16px'
  box.style.whiteSpace = 'pre-wrap'
  box.textContent = `화면을 그리는 중 오류가 났습니다\n\n${message}`
  root.appendChild(box)
}

class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <pre className="error" style={{ margin: 16, whiteSpace: 'pre-wrap' }}>
          화면을 그리는 중 오류가 났습니다{'\n\n'}
          {String(this.state.error?.stack || this.state.error)}
        </pre>
      )
    }
    return this.props.children
  }
}

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
} catch (e) {
  showFatal(String(e?.stack || e))
}
