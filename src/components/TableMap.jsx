import { useState } from 'react'
import { INIT_TABLES } from '../data/seed'

const ZONES = [
  { zone: 'Window',  tables: '1–5',   ids: [1,2,3,4,5] },
  { zone: 'Center',  tables: '6–10',  ids: [6,7,8,9,10] },
  { zone: 'VIP',     tables: '11–13', ids: [11,12,13] },
  { zone: 'Outdoor', tables: '14–15', ids: [14,15] },
]

export default function TableMap() {
  const [tables, setTables] = useState(INIT_TABLES)

  function cycleStatus(id) {
    const cycle = { available: 'occupied', occupied: 'reserved', reserved: 'available' }
    setTables((prev) => prev.map((t) => t.id === id ? { ...t, status: cycle[t.status] } : t))
  }

  const count = (s) => tables.filter((t) => t.status === s).length

  return (
    <>
      <div className="stat-grid">
        {[
          { l: 'Available', v: count('available'), c: 'var(--green)' },
          { l: 'Occupied',  v: count('occupied'),  c: 'var(--red)' },
          { l: 'Reserved',  v: count('reserved'),  c: 'var(--accent)' },
          { l: 'Total',     v: tables.length,       c: 'var(--muted)' },
        ].map((s) => (
          <div key={s.l} className="stat-card">
            <div className="label">{s.l}</div>
            <div className="value" style={{ color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="table-map">
        <div className="section-header" style={{ marginBottom: 0 }}>
          <h3>Live Floor Plan</h3>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Click a table to cycle its status</span>
        </div>

        <div className="table-grid">
          {tables.map((t) => (
            <div
              key={t.id}
              className={`table-item ${t.status}`}
              onClick={() => cycleStatus(t.id)}
              title={`Table ${t.id} · ${t.seats} seats · ${t.status}`}
            >
              <i className="ti ti-armchair" />
              T-{t.id}
              <span style={{ fontSize: 9, opacity: .7 }}>{t.seats}p</span>
            </div>
          ))}
        </div>

        <div className="table-legend">
          <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--green)' }} />Available</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--red)' }} />Occupied</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--accent)' }} />Reserved</div>
        </div>
      </div>

      <div className="panel">
        <h3 style={{ fontSize: 14, marginBottom: '.75rem' }}>Seating Zones</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '.5rem' }}>
          {ZONES.map((z) => {
            const zTables = tables.filter((t) => z.ids.includes(t.id))
            const avail = zTables.filter((t) => t.status === 'available').length
            return (
              <div
                key={z.zone}
                style={{ background: 'var(--card2)', borderRadius: 8, padding: '.75rem', border: '1px solid var(--border)' }}
              >
                <p style={{ fontSize: 12, fontWeight: 500 }}>{z.zone} Zone</p>
                <p style={{ fontSize: 11, color: 'var(--muted)' }}>Tables {z.tables}</p>
                <p style={{ fontSize: 11, color: avail > 0 ? 'var(--green)' : 'var(--red)', marginTop: 2 }}>
                  {avail} available
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
