import { useState } from 'react'

export default function Reservations({ reservations, currentUser, onUpdateStatus, onDelete, onNew }) {
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')

  const filtered = reservations.filter(r => {
    const matchSearch = r.guest?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || r.status === filter
    return matchSearch && matchFilter
  })

  const statusClass = s => `badge badge-${s}`

  return (
    <div>
      <div className="page-header">
        <div className="card-title" style={{ fontSize: 18 }}>All Reservations ({reservations.length})</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="search-bar">
            <i className="ti ti-search" />
            <input placeholder="Search guest…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="field" style={{ margin: 0, padding: '8px 12px', width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="seated">Seated</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="btn btn-primary btn-sm" onClick={onNew}>
            <i className="ti ti-plus" /> New
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {filtered.length === 0 ? (
            <div className="empty-state"><i className="ti ti-calendar-off" /><p>No reservations found</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Guest</th><th>Date</th><th>Time</th><th>Guests</th><th>Table</th><th>Status</th>
                  {currentUser?.role === 'admin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--text-light)', fontSize: 12 }}>#{r.id}</td>
                    <td style={{ fontWeight: 600 }}>{r.guest}</td>
                    <td>{r.date}</td>
                    <td>{r.time}</td>
                    <td>{r.guests}</td>
                    <td>{r.table_id ? `T${r.table_id}` : '—'}</td>
                    <td><span className={statusClass(r.status)}>{r.status}</span></td>
                    {currentUser?.role === 'admin' && (
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <select
                            style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--cream-deep)', background: 'var(--cream)', fontSize: 12, cursor: 'pointer' }}
                            value={r.status}
                            onChange={e => onUpdateStatus(r.id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="seated">Seated</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => onDelete(r.id)} title="Delete">
                            <i className="ti ti-trash" style={{ fontSize: 13 }} />
                          </button>
                        </div>
                      </td>
                    )}
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
