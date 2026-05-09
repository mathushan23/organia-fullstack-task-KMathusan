import { useState } from 'react'

function RegisterPage({ apiUrl, onRegister, onShowLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [status, setStatus] = useState('')

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const submit = async (event) => {
    event.preventDefault()
    setStatus('Please wait...')

    try {
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const data = await response.json()
      onRegister(data)
      setStatus('')
    } catch {
      setStatus('Registration failed')
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="page-header">
        <h1>Register</h1>
        <p>Create your Organia account</p>
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

      <button type="submit">Create Account</button>

      <button type="button" className="link-button" onClick={onShowLogin}>
        Already have an account
      </button>

      {status && <p className="error">{status}</p>}
    </form>
  )
}

export default RegisterPage
