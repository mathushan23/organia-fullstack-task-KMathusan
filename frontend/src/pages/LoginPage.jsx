import { useState } from 'react'

function LoginPage({ apiUrl, onLogin, onShowRegister }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('')

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const submit = async (event) => {
    event.preventDefault()
    setStatus('Please wait...')

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
      onLogin(data)
      setStatus('')
    } catch {
      setStatus('Invalid email or password')
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="page-header">
        <h1>Login</h1>
        <p>Access your Organia account</p>
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

      <button type="submit">Login</button>

      <button type="button" className="link-button" onClick={onShowRegister}>
        Create an account
      </button>

      {status && <p className="error">{status}</p>}
    </form>
  )
}

export default LoginPage
