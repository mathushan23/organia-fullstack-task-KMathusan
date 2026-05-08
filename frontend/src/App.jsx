import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('Connecting to backend...')

  useEffect(() => {
    fetch('http://localhost:8082/api/test')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Backend request failed')
        }

        return response.text()
      })
      .then((data) => setMessage(data))
      .catch(() => setMessage('Backend connection failed'))
  }, [])

  return (
    <main className="app">
      <section className="panel">
        <h1>Organia Fullstack App</h1>
        <p>{message}</p>
      </section>
    </main>
  )
}

export default App
