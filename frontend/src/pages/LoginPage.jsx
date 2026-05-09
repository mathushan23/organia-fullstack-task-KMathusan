import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'

function LoginPage({ apiUrl, onLogin, onShowRegister }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!formRef.current) {
      return
    }

    animate(formRef.current, {
      opacity: [0, 1],
      scale: [0.96, 1],
      y: [30, 0],
      duration: 700,
      ease: 'outBack',
    })

    animate(formRef.current.querySelectorAll('label, button, .auth-switch'), {
      opacity: [0, 1],
      x: [-18, 0],
      delay: (_, index) => 160 + index * 70,
      duration: 420,
      ease: 'outQuad',
    })
  }, [])

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const submit = async (event) => {
    event.preventDefault()
    setStatus('Please wait...')
    setIsSubmitting(true)

    animate(buttonRef.current, {
      scale: [1, 0.96, 1],
      duration: 420,
      ease: 'outBack',
    })

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      setStatus('Login successful. Redirecting...')

      animate(formRef.current, {
        opacity: [1, 0],
        y: [0, -24],
        scale: [1, 0.98],
        duration: 520,
        ease: 'inOutQuad',
        onComplete: () => onLogin(data),
      })
    } catch {
      setStatus('Invalid email or password')
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={submit}>
      <div className="page-header">
        <span className="brand-badge">Task Management System</span>
        <h1>Login</h1>
        <p>Access your account</p>
      </div>

      <label>
        Email
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={updateField}
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={updateField}
          minLength="8"
          required
        />
      </label>

      <button ref={buttonRef} type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Login'}
      </button>

      <button type="button" className="link-button auth-switch" onClick={onShowRegister}>
        Create an account
      </button>

      {status && (
        <p className={status.includes('successful') ? 'success' : 'error'}>
          {status}
        </p>
      )}
    </form>
  )
}

export default LoginPage
