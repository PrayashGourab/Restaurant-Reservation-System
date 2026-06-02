import { useState } from 'react'
import { initials } from '../data/seed'

const ALL_TAGS = ['window', 'vip', 'outdoor', 'birthday', 'anniversary', 'gluten-free', 'vegetarian', 'halal', 'quiet corner']

export default function Customers({ users }) {
  const [activeTags, setActiveTags] = useState({ halal: true })

  function toggleTag(t) {
    setActiveTags((prev) => ({ ...prev, [t]: !prev[t] }))
  }

  return (
    <>
      <div className="stat-grid">
        {[
          { l: 'Total Customers', v: users.length },
          { l: 'Admins',          v: users.filter((u) => u.role === 'admin').length },
          { l: 'Customers',       v: users.filter((u) => u.role === 'customer').length },
          { l: 'VIP Members',     v: 3 },
        ].map((s) => (
          <div key={s.l} className="stat-card">
            <div className="label">{s.l}</div>
            <div className="value">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: '.5rem' }}>
          Preference tags (click to toggle your preferences)
        </p>
        <div>
          {ALL_TAGS.map((t) => (
            <span
              key={t}
              className={`pref-tag${activeTags[t] ? ' active' : ''}`}
              onClick={() => toggleTag(t)}
            >
              {activeTags[t] && <i className="ti ti-check" style={{ fontSize: 11 }} />}
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="section-header">
        <h3>Registered Users</h3>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{users.length} total</span>
      </div>

      <div className="res-list">
        {users.map((u) => (
          <div key={u.id} className="res-row">
            <div className="avatar" style={{ width: 36, height: 36, fontSize: 12 }}>{initials(u.name)}</div>
            <div className="res-info">
              <div className="res-name">{u.name}</div>
              <div className="res-meta">
                <span>{u.email}</span>
                {u.phone && <span>{u.phone}</span>}
                <span>{u.visits} visit{u.visits !== 1 ? 's' : ''}</span>
                <span>Joined {u.joined}</span>
              </div>
            </div>
            <span className={`status-pill ${u.role === 'admin' ? 'seated' : 'confirmed'}`}>
              {u.role}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}
