
import { useState } from 'react'
import { supabase } from './supabase'
import './App.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        alert(error.message)
      } else {
        alert('Account created! You can now log in.')
        setIsSignup(false)
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        alert(error.message)
      } else {
        window.location.href = '/'
      }
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        <h1>Rent your vehicle in minutes</h1>
        <p>Find your ride, choose your dates, and book it online.</p>
      </header>

      <main className="auth-card">
        <h2>{isSignup ? 'Create Account' : 'Login'}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <button type="submit">
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <button
          type="button"
          className="auth-switch"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? 'Already registered? Login'
            : 'New here? Sign Up'}
        </button>
      </main>

      <footer className="auth-footer">
        © 2026 Vehicle Rental System
      </footer>
    </div>
  )
}

export default Login
