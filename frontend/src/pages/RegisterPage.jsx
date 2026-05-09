import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'

function RegisterPage({ apiUrl, onRegister, onShowLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
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

    if (!form.name.trim()) {
      setStatus('Name is required')
      return
    }

    if (form.password.length < 8) {
      setStatus('Password must be at least 8 characters')
      return
    }

    if (form.password !== form.confirmPassword) {
      setStatus('Passwords do not match')
      return
    }

    setStatus('Please wait...')
    setIsSubmitting(true)

    animate(buttonRef.current, {
      scale: [1, 0.96, 1],
      duration: 420,
      ease: 'outBack',
    })

    try {
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => null)
        throw new Error(error?.message || 'Registration failed')
      }

      const data = await response.json()
      setStatus('Account created. Redirecting...')

      animate(formRef.current, {
        opacity: [1, 0],
        y: [0, -24],
        scale: [1, 0.98],
        duration: 520,
        ease: 'inOutQuad',
        onComplete: () => onRegister(data),
      })
    } catch (error) {
      setStatus(error.message)
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={submit}>
      <div className="page-header">
        <span className="brand-badge">Task Management System</span>
        <h1>Register</h1>
        <p>Create your account</p>
      </div>

      <label>
        Name
        <input
          name="name"
          value={form.name}
          onChange={updateField}
          required
        />
      </label>

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

      <label>
        Confirm Password
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={updateField}
          minLength="8"
          required
        />
      </label>

      <button ref={buttonRef} type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>

      <button type="button" className="link-button auth-switch" onClick={onShowLogin}>
        Already have an account
      </button>

      {status && (
        <p className={status.includes('Redirecting') ? 'success' : 'error'}>
          {status}
        </p>
      )}
    </form>
  )
}

export default RegisterPage
