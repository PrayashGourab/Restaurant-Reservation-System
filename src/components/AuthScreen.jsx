import { useState } from 'react'

export default function AuthScreen({ users, setUsers, setCurrentUser }) {
  const [tab, setTab] = useState('login')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' })
  const [error, setError] = useState('')

  function handleLogin() {
    const u = users.find((u) => u.email === loginForm.email && u.password === loginForm.password)
    if (u) { setCurrentUser(u); setError('') }
    else setError('Invalid email or password.')
  }

  function handleRegister() {
    if (!regForm.name || !regForm.email || !regForm.password) { setError('Please fill all required fields.'); return }
    if (users.find((u) => u.email === regForm.email)) { setError('Email already registered.'); return }
    const nu = {
      id: users.length + 1,
      ...regForm,
      prefs: { allergen: [], seating: 'any', occasion: '' },
      visits: 0,
      joined: new Date().toISOString().split('T')[0],
    }
    setUsers([...users, nu])
    setCurrentUser(nu)
    setError('')
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">🍽 Dine Reserve</h1>
          <p className="auth-subtitle">Restaurant Reservation System</p>
          <p className="auth-subtitle" style={{ marginTop: 4 }}>
            DBMS Project — Metropolitan University, Sylhet
          </p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => { setTab('login'); setError('') }}>
            Sign In
          </button>
          <button className={`auth-tab${tab === 'register' ? ' active' : ''}`} onClick={() => { setTab('register'); setError('') }}>
            Register
          </button>
        </div>

        <div className="auth-body">
          {tab === 'login' ? (
            <>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              {error && <p className="auth-error">{error}</p>}
              <button className="btn-primary" onClick={handleLogin}>Sign In</button>
              <p className="auth-msg">Demo credentials: admin@dine.com / admin123</p>
            </>
          ) : (
            <>
              <div className="field">
                <label>Full Name *</label>
                <input placeholder="Your full name" value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} />
              </div>
              <div className="field">
                <label>Email *</label>
                <input type="email" placeholder="your@email.com" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} />
              </div>
              <div className="field">
                <label>Phone</label>
                <input placeholder="+880 1XX XXX XXXX" value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} />
              </div>
              <div className="field">
                <label>Password *</label>
                <input type="password" placeholder="Min 6 characters" value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} />
              </div>
              <div className="field">
                <label>Role</label>
                <select value={regForm.role} onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {error && <p className="auth-error">{error}</p>}
              <button className="btn-primary" onClick={handleRegister}>Create Account</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
