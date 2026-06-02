import { useState } from 'react'

const NOTIF_SETTINGS = [
  { k: 'reminders',   l: 'Reservation Reminders', d: 'Email & SMS before guest arrival' },
  { k: 'traffic',     l: 'Traffic & Weather Alerts', d: 'Travel warnings for guests' },
  { k: 'promo',       l: 'Promotional Offers', d: 'Special deals and event invites' },
  { k: 'sms',         l: 'SMS Notifications', d: 'Text message updates' },
  { k: 'waitNotify',  l: 'Waitlist Alerts', d: 'Notify when table becomes available' },
  { k: 'cancels',     l: 'Cancellation Alerts', d: 'Instant cancellation notifications' },
]

export default function Settings({ currentUser }) {
  const [toggles, setToggles] = useState({ reminders: true, traffic: false, promo: true, sms: true, waitNotify: true, cancels: true })
  const [sysForm, setSysForm] = useState({ name: 'Dine Reserve', capacity: 60, open: '11:00', close: '23:00', slot: '30', currency: 'BDT' })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <div className="grid2">
        {/* Account */}
        <div className="panel">
          <h3 style={{ fontSize: 14, marginBottom: '1rem' }}>Account Information</h3>
          {[
            ['Full Name', currentUser.name],
            ['Email', currentUser.email],
            ['Role', currentUser.role],
            ['Phone', currentUser.phone || '—'],
            ['Member Since', currentUser.joined],
          ].map(([l, v]) => (
            <div key={l} className="pref-row">
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{l}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '.5rem' }}>
            <button className="btn-sm">Change Password</button>
            <button className="btn-sm">Edit Profile</button>
          </div>
        </div>

        {/* Notifications */}
        <div className="panel">
          <h3 style={{ fontSize: 14, marginBottom: '1rem' }}>Notification Preferences</h3>
          {NOTIF_SETTINGS.map(({ k, l, d }) => (
            <div key={k} className="pref-row">
              <div className="pref-label">
                <p>{l}</p>
                <span>{d}</span>
              </div>
              <button
                className={`toggle${toggles[k] ? ' on' : ''}`}
                onClick={() => setToggles((t) => ({ ...t, [k]: !t[k] }))}
                aria-label={l}
              />
            </div>
          ))}
        </div>
      </div>

      {/* System Config */}
      <div className="panel" style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: 14, marginBottom: '1rem' }}>System Configuration</h3>
        <div className="grid2">
          <div className="field">
            <label>Restaurant Name</label>
            <input value={sysForm.name} onChange={(e) => setSysForm({ ...sysForm, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Max Seating Capacity</label>
            <input type="number" value={sysForm.capacity} onChange={(e) => setSysForm({ ...sysForm, capacity: e.target.value })} />
          </div>
          <div className="field">
            <label>Opening Time</label>
            <input type="time" value={sysForm.open} onChange={(e) => setSysForm({ ...sysForm, open: e.target.value })} />
          </div>
          <div className="field">
            <label>Closing Time</label>
            <input type="time" value={sysForm.close} onChange={(e) => setSysForm({ ...sysForm, close: e.target.value })} />
          </div>
          <div className="field">
            <label>Reservation Slot Interval</label>
            <select value={sysForm.slot} onChange={(e) => setSysForm({ ...sysForm, slot: e.target.value })}>
              <option value="15">Every 15 minutes</option>
              <option value="30">Every 30 minutes</option>
              <option value="60">Every 1 hour</option>
            </select>
          </div>
          <div className="field">
            <label>Currency</label>
            <select value={sysForm.currency} onChange={(e) => setSysForm({ ...sysForm, currency: e.target.value })}>
              <option value="BDT">BDT (৳)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
        <button className="btn-sm btn-accent" onClick={handleSave} style={{ marginTop: '.5rem' }}>
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>

      {/* Security */}
      <div className="panel" style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: 14, marginBottom: '1rem' }}>Security & Access</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '.75rem' }}>
          {[
            { icon: 'ti-lock', l: 'Two-Factor Auth', sub: 'Not enabled' },
            { icon: 'ti-history', l: 'Login History', sub: '3 recent sessions' },
            { icon: 'ti-shield', l: 'Active Sessions', sub: '1 device' },
            { icon: 'ti-trash', l: 'Delete Account', sub: 'Irreversible' },
          ].map((s) => (
            <div
              key={s.l}
              style={{ background: 'var(--card2)', borderRadius: 8, padding: '.75rem', border: '1px solid var(--border)', cursor: 'pointer' }}
            >
              <i className={`ti ${s.icon}`} style={{ fontSize: 20, color: 'var(--accent)', display: 'block', marginBottom: '.25rem' }} />
              <p style={{ fontSize: 12, fontWeight: 500 }}>{s.l}</p>
              <p style={{ fontSize: 11, color: 'var(--muted)' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
