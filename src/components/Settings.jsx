import { useState } from 'react'

const API = 'http://localhost:5000'

function initials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function Settings({ currentUser }) {
  const [profile, setProfile]     = useState({ name: currentUser?.name || '', email: currentUser?.email || '', phone: currentUser?.phone || '' })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [msg, setMsg]             = useState('')
  const [err, setErr]             = useState('')

  async function handleResetPassword() {
    setMsg(''); setErr('')
    if (!passwords.newPass || !passwords.confirm) { setErr('Please fill all password fields.'); return }
    if (passwords.newPass !== passwords.confirm)  { setErr('Passwords do not match.'); return }
    if (passwords.newPass.length < 6)             { setErr('Password must be at least 6 characters.'); return }
    try {
      const res  = await fetch(`${API}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email, newPassword: passwords.newPass }),
      })
      const data = await res.json()
      if (data.success) { setMsg('Password updated successfully!'); setPasswords({ current: '', newPass: '', confirm: '' }) }
      else setErr(data.error || 'Failed to update password.')
    } catch { setErr('Cannot connect to server.') }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      {/* Profile */}
      <div className="card settings-section" style={{ marginBottom: 20 }}>
        <div className="card-header"><span className="card-title">Profile</span></div>
        <div className="card-body">
          <div className="profile-pic-wrap">
            <div className="profile-pic">{initials(profile.name)}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{profile.name}</div>
              <div style={{ color: 'var(--text-light)', fontSize: 13 }}>{currentUser?.role}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field" style={{ margin: 0 }}>
              <label>Full Name</label>
              <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Email Address</label>
              <input value={profile.email} disabled style={{ opacity: .6 }} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Phone</label>
              <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="Optional" />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Role</label>
              <input value={currentUser?.role || ''} disabled style={{ opacity: .6, textTransform: 'capitalize' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="card-header"><span className="card-title">Change Password</span></div>
        <div className="card-body">
          <div className="field">
            <label>New Password</label>
            <input type="password" placeholder="Min 6 characters" value={passwords.newPass}
              onChange={e => setPasswords({ ...passwords, newPass: e.target.value })} />
          </div>
          <div className="field">
            <label>Confirm New Password</label>
            <input type="password" placeholder="Repeat new password" value={passwords.confirm}
              onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} />
          </div>
          {err && <p className="auth-error">{err}</p>}
          {msg && <p className="auth-success">{msg}</p>}
          <button className="btn btn-primary" onClick={handleResetPassword}>Update Password</button>
        </div>
      </div>
    </div>
  )
}
