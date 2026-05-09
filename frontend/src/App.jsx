import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import './App.css'

const API_URL = 'http://localhost:8082/api'

function App() {
  const [page, setPage] = useState('login')
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('auth')
    return stored ? JSON.parse(stored) : null
  })
  const [protectedMessage, setProtectedMessage] = useState('')

  useEffect(() => {
    if (!auth) {
      setProtectedMessage('')
      return
    }

    const path =
      auth.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard'

    fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then((response) => response.text())
      .then((data) => setProtectedMessage(data))
      .catch(() => setProtectedMessage('Protected request failed'))
  }, [auth])

  const saveAuth = (data) => {
    localStorage.setItem('auth', JSON.stringify(data))
    setAuth(data)
  }

  const logout = () => {
    localStorage.removeItem('auth')
    setAuth(null)
    setPage('login')
  }

  return (
    <main className="app">
      <section className="panel">
        <h1>Organia</h1>

        {auth ? (
          <div className="account">
            <p className="eyebrow">{auth.role}</p>
            <h2>{auth.name}</h2>
            <p>{auth.email}</p>
            <p className="success">{protectedMessage}</p>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </div>
        ) : page === 'register' ? (
          <RegisterPage
            apiUrl={API_URL}
            onRegister={saveAuth}
            onShowLogin={() => setPage('login')}
          />
        ) : (
          <LoginPage
            apiUrl={API_URL}
            onLogin={saveAuth}
            onShowRegister={() => setPage('register')}
          />
        )}
      </section>
    </main>
  )
}

export default App
