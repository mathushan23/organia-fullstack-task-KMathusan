import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import TaskPage from './pages/TaskPage.jsx'
import './App.css'

const API_URL = 'http://localhost:8082/api'

function App() {
  const [page, setPage] = useState('login')
  const authShellRef = useRef(null)
  const backgroundRef = useRef(null)
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('auth')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (!backgroundRef.current) {
      return
    }

    animate(backgroundRef.current.querySelectorAll('.flow-dot'), {
      translateX: ['-10%', '108%'],
      opacity: [0, 1, 1, 0],
      delay: stagger(650),
      duration: 5200,
      loop: true,
      ease: 'inOutQuad',
    })

    animate(backgroundRef.current.querySelectorAll('.bg-panel'), {
      translateY: [-10, 14],
      rotate: [-0.8, 0.8],
      delay: stagger(300),
      duration: 4600,
      loop: true,
      alternate: true,
      ease: 'inOutQuad',
    })

    animate(backgroundRef.current.querySelectorAll('.bg-glow'), {
      scale: [1, 1.08],
      opacity: [0.28, 0.42],
      duration: 3800,
      loop: true,
      alternate: true,
      ease: 'inOutQuad',
    })

    animate(backgroundRef.current.querySelector('.background-grid'), {
      translateX: [-10, 10],
      translateY: [-6, 6],
      duration: 9000,
      loop: true,
      alternate: true,
      ease: 'inOutQuad',
    })

    animate(backgroundRef.current.querySelectorAll('.bg-progress'), {
      scaleX: [0.35, 1],
      transformOrigin: 'left center',
      delay: stagger(240),
      duration: 1800,
      loop: true,
      alternate: true,
      ease: 'inOutQuad',
    })

    animate(backgroundRef.current.querySelectorAll('.bg-kanban'), {
      translateY: [8, -12],
      translateX: [-4, 4],
      rotate: [-0.6, 0.6],
      delay: stagger(420),
      duration: 5200,
      loop: true,
      alternate: true,
      ease: 'inOutQuad',
    })

  }, [])

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
      <div
        ref={backgroundRef}
        className={`app-background ${auth ? 'dashboard-background' : 'auth-background'}`}
        aria-hidden="true"
      >
        <div className="background-mesh" />
        <div className="background-grid" />
        <div className="background-dots" />
        <div className="bg-glow bg-glow-one" />
        <div className="bg-glow bg-glow-two" />
        <div className="flow-line flow-line-one">
          <span className="flow-dot" />
        </div>
        <div className="flow-line flow-line-two">
          <span className="flow-dot" />
        </div>
        <div className="flow-line flow-line-three">
          <span className="flow-dot" />
        </div>

        {!auth && (
          <>
            <div className="bg-panel bg-panel-one">
              <span />
              <span />
              <i className="bg-progress" />
              <strong>Tasks</strong>
            </div>
            <div className="bg-panel bg-panel-two">
              <span />
              <span />
              <i className="bg-progress" />
              <strong>Progress</strong>
            </div>

            <div className="bg-kanban bg-kanban-one">
              <b />
              <span />
              <span />
              <span />
            </div>
            <div className="bg-kanban bg-kanban-two">
              <b />
              <span />
              <span />
            </div>
          </>
        )}
      </div>

      {auth ? (
        <TaskPage apiUrl={API_URL} auth={auth} onLogout={logout} />
      ) : (
        <section ref={authShellRef} className="auth-shell">
          <section className="panel auth-panel">
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
        </section>
      )}
    </main>
  )
}

export default App
