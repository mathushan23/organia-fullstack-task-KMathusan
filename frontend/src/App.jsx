import { useState } from 'react'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import TaskPage from './pages/TaskPage.jsx'
import './App.css'

const API_URL = 'http://localhost:8082/api'

function App() {
  const [page, setPage] = useState('login')
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('auth')
    return stored ? JSON.parse(stored) : null
  })

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
      {auth ? (
        <TaskPage apiUrl={API_URL} auth={auth} onLogout={logout} />
      ) : (
        <section className="panel">
          {page === 'register' ? (
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
      )}
    </main>
  )
}

export default App
