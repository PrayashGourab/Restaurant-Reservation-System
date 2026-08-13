import { useState, useEffect } from 'react'

const API = 'http://localhost:5000'

export default function TableMap() {
  const [tables, setTables] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch(`${API}/tables`).then(r => r.json()).then(setTables).catch(() => {})
  }, [])

  async function toggleStatus(table) {
    const next = table.status === 'available' ? 'occupied' : 'available'
    try {
      await fetch(`${API}/tables/${table.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      setTables(prev => prev.map(t => t.id === table.id ? { ...t, status: next } : t))
    } catch { alert('Failed to update table.') }
  }

  const icons = { standard: '🪑', window: '🪟', vip: '⭐', outdoor: '🌿', group: '👥' }
  const available = tables.filter(t => t.status === 'available').length
  const occupied  = tables.filter(t => t.status === 'occupied').length
  const reserved  = tables.filter(t => t.status === 'reserved').length

  return (
    <div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        {[['available', '#2D7A4F', available], ['occupied', '#C0392B', occupied], ['reserved', '#B5860D', reserved]].map(([s, c, n]) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            <span style={{ textTransform: 'capitalize', color: 'var(--text-soft)' }}>{s}</span>
            <span style={{ fontWeight: 700, color: 'var(--text)' }}>{n}</span>
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-light)' }}>Click a table to toggle status</span>
      </div>

      <div className="table-map-grid">
        {tables.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}><i className="ti ti-armchair-off" /><p>No tables found</p></div>
        ) : tables.map(t => (
          <div key={t.id} className={`table-card ${t.status}`} onClick={() => toggleStatus(t)}>
            <div className="table-icon">{icons[t.type] || '🪑'}</div>
            <div className="table-label">{t.label}</div>
            <div className="table-seats">{t.seats} seats</div>
            <div style={{ marginTop: 8 }}>
              <span className={`badge badge-${t.status}`}>{t.status}</span>
            </div>
            <div className="table-type" style={{ marginTop: 4 }}>{t.type}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
