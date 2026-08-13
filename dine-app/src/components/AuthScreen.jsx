import { useState } from 'react'

const API = 'http://localhost:5000'

export default function AuthScreen({ onLogin, loginError, loading }) {
  const [tab,        setTab]        = useState('login')
  const [showForgot, setShowForgot] = useState(false)
  const [loginForm,  setLoginForm]  = useState({ email: '', password: '' })
  const [regForm,    setRegForm]    = useState({ name: '', email: '', password: '', phone: '', role: 'customer' })
  const [forgotForm, setForgotForm] = useState({ email: '', newPassword: '', confirm: '' })
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')
  const [busy,       setBusy]       = useState(false)

  function handleLogin() {
    if (!loginForm.email || !loginForm.password) { setError('Please enter email and password.'); return }
    setError('')
    onLogin(loginForm.email, loginForm.password)
  }

  async function handleRegister() {
    setError('')
    if (!regForm.name || !regForm.email || !regForm.password) { setError('Please fill all required fields.'); return }
    if (regForm.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setBusy(true)
    try {
      const res  = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess('Account created! You can now sign in.')
        setTimeout(() => { setTab('login'); setSuccess(''); setLoginForm({ email: regForm.email, password: '' }) }, 2000)
      } else { setError(data.error || 'Registration failed.') }
    } catch { setError('Cannot connect to server.') }
    setBusy(false)
  }

  async function handleForgotPassword() {
    setError('')
    if (!forgotForm.email) { setError('Please enter your email.'); return }
    if (!forgotForm.newPassword || !forgotForm.confirm) { setError('Please fill all fields.'); return }
    if (forgotForm.newPassword !== forgotForm.confirm) { setError('Passwords do not match.'); return }
    if (forgotForm.newPassword.length < 6) { setError('Password must be at least 6 characters.'); return }
    setBusy(true)
    try {
      const res  = await fetch(`${API}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotForm.email, newPassword: forgotForm.newPassword }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess('Password reset! You can now sign in.')
        setTimeout(() => { setShowForgot(false); setTab('login'); setSuccess(''); setForgotForm({ email: '', newPassword: '', confirm: '' }) }, 2000)
      } else { setError(data.error || 'Reset failed.') }
    } catch { setError('Cannot connect to server.') }
    setBusy(false)
  }

  function switchTab(t) { setTab(t); setError(''); setSuccess('') }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🍽 Dine<span>.</span></div>
          <div className="auth-tagline">Restaurant Management System</div>
        </div>

        {!showForgot ? (
          <>
            <div className="auth-tabs">
              <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => switchTab('login')}>Sign In</button>
              <button className={`auth-tab${tab === 'register' ? ' active' : ''}`} onClick={() => switchTab('register')}>Register</button>
            </div>

            <div className="auth-body">
              {tab === 'login' ? (
                <>
                  <div className="field">
                    <label>Email Address</label>
                    <input type="email" placeholder="your@email.com" value={loginForm.email}
                      onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Password</label>
                    <input type="password" placeholder="••••••••" value={loginForm.password}
                      onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                  </div>
                  <div className="forgot-link" onClick={() => { setShowForgot(true); setError(''); setSuccess('') }}>
                    Forgot your password?
                  </div>
                  {(error || loginError) && <p className="auth-error">{error || loginError}</p>}
                  {success && <p className="auth-success">{success}</p>}
                  <button className="btn-primary-full" onClick={handleLogin} disabled={loading || busy}>
                    {loading ? 'Signing in…' : 'Sign In'}
                  </button>
                  <p className="auth-msg">Demo: admin@dine / admin123</p>
                </>
              ) : (
                <>
                  <div className="field">
                    <label>Full Name *</label>
                    <input placeholder="Your full name" value={regForm.name}
                      onChange={e => setRegForm({ ...regForm, name: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Email Address *</label>
                    <input type="email" placeholder="your@email.com" value={regForm.email}
                      onChange={e => setRegForm({ ...regForm, email: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Phone Number</label>
                    <input placeholder="+880 1XX XXX XXXX" value={regForm.phone}
                      onChange={e => setRegForm({ ...regForm, phone: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Password *</label>
                    <input type="password" placeholder="Min 6 characters" value={regForm.password}
                      onChange={e => setRegForm({ ...regForm, password: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Account Type</label>
                    <select value={regForm.role} onChange={e => setRegForm({ ...regForm, role: e.target.value })}>
                      <option value="customer">Customer</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {error && <p className="auth-error">{error}</p>}
                  {success && <p className="auth-success">{success}</p>}
                  <button className="btn-primary-full" onClick={handleRegister} disabled={busy}>
                    {busy ? 'Creating…' : 'Create Account'}
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="auth-body" style={{ paddingTop: '1.5rem' }}>
            <div className="back-link" onClick={() => { setShowForgot(false); setError(''); setForgotForm({ email: '', newPassword: '', confirm: '' }) }}>
              ← Back to login
            </div>
            <h3 style={{ fontSize: 18, marginBottom: '1rem', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>Reset Password</h3>
            <div className="field">
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" value={forgotForm.email}
                onChange={e => setForgotForm({ ...forgotForm, email: e.target.value })} />
            </div>
            <div className="field">
              <label>New Password</label>
              <input type="password" placeholder="Min 6 characters" value={forgotForm.newPassword}
                onChange={e => setForgotForm({ ...forgotForm, newPassword: e.target.value })} />
            </div>
            <div className="field">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm new password" value={forgotForm.confirm}
                onChange={e => setForgotForm({ ...forgotForm, confirm: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleForgotPassword()} />
            </div>
            {error && <p className="auth-error">{error}</p>}
            {success && <p className="auth-success">{success}</p>}
            <button className="btn-primary-full" onClick={handleForgotPassword} disabled={busy}>
              {busy ? 'Resetting…' : 'Reset Password'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
