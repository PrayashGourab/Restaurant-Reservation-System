import { useState, useEffect } from 'react'

const API = 'http://localhost:5000'

function initials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function Customers({ isAdmin }) {
  const [users, setUsers]   = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(`${API}/users`).then(r => r.json()).then(setUsers).catch(() => {})
  }, [])

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <div className="card-title" style={{ fontSize: 18 }}>Customers ({users.length})</div>
        <div className="search-bar">
          <i className="ti ti-search" />
          <input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {filtered.length === 0 ? (
            <div className="empty-state"><i className="ti ti-users-off" /><p>No customers found</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  {/* Only admins see the Role column */}
                  {isAdmin && <th>Role</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="customer-avatar">{initials(u.name)}</div>
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-soft)' }}>{u.email}</td>
                    <td style={{ color: 'var(--text-soft)' }}>{u.phone || '—'}</td>
                    {isAdmin && <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
