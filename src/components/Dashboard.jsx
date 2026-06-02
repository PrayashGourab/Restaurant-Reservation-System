import { initials } from '../data/seed'
import { ANALYTICS } from '../data/seed'

function ResRow({ r }) {
  return (
    <div className="res-row">
      <div className="res-avatar">{initials(r.name)}</div>
      <div className="res-info">
        <div className="res-name">{r.name}</div>
        <div className="res-meta">
          <span><i className="ti ti-clock" style={{ fontSize: 12 }} /> {r.time}</span>
          <span><i className="ti ti-users" style={{ fontSize: 12 }} /> {r.guests}</span>
          {r.table && <span>Table {r.table}</span>}
          {r.notes && <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>{r.notes.slice(0, 22)}…</span>}
        </div>
      </div>
      <span className={`status-pill ${r.status}`}>{r.status}</span>
    </div>
  )
}

export default function Dashboard({ reservations, waitlist }) {
  const today = new Date().toISOString().split('T')[0]
  const todayRes = reservations.filter((r) => r.date === today)
  const pending = reservations.filter((r) => r.status === 'pending').length
  const confirmed = todayRes.filter((r) => r.status === 'confirmed').length
  const seated = todayRes.filter((r) => r.status === 'seated').length
  const totalGuests = todayRes.reduce((s, r) => s + Number(r.guests), 0)

  const stats = [
    { label: "Today's Reservations", value: todayRes.length, sub: '↑ 3 from yesterday', cls: 'up' },
    { label: 'Guests Expected',       value: totalGuests,      sub: 'Across all bookings', cls: '' },
    { label: 'Confirmed',             value: confirmed,         sub: 'Ready to seat',      cls: 'up' },
    { label: 'Pending Approval',      value: pending,           sub: 'Needs action',       cls: pending > 0 ? 'down' : '' },
    { label: 'Currently Seated',      value: seated,            sub: 'Active tables',      cls: '' },
    { label: 'On Waitlist',           value: waitlist.length,   sub: 'Awaiting table',     cls: '' },
  ]

  return (
    <>
      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="label">{s.label}</div>
            <div className="value">{s.value}</div>
            <div className={`sub ${s.cls}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid2">
        <div>
          <div className="section-header">
            <h3>Today's Bookings</h3>
          </div>
          <div className="res-list">
            {todayRes.slice(0, 5).map((r) => <ResRow key={r.id} r={r} />)}
            {todayRes.length === 0 && (
              <div className="empty">
                <i className="ti ti-calendar-off" />
                No reservations today
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="section-header">
            <h3>Peak Hour Forecast</h3>
          </div>
          <div className="panel">
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: '.75rem' }}>
              Occupancy forecast (% capacity)
            </p>
            {ANALYTICS.busyHours.map((h, i) => (
              <div key={h} className="bar-row">
                <span className="bar-label">{h}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${ANALYTICS.busyVals[i]}%`,
                      background: ANALYTICS.busyVals[i] > 80 ? 'var(--red)' : 'var(--accent)',
                    }}
                  />
                </div>
                <span className="bar-val">{ANALYTICS.busyVals[i]}%</span>
              </div>
            ))}
          </div>

          <div className="panel" style={{ marginTop: '1rem' }}>
            <div className="section-header" style={{ marginBottom: '.75rem' }}>
              <h3 style={{ fontSize: 14 }}>Waitlist Queue</h3>
            </div>
            {waitlist.slice(0, 3).map((w, i) => (
              <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.5rem' }}>
                <div className="wait-num">{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{w.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {w.guests} guests · Est. {w.estWait}
                  </p>
                </div>
              </div>
            ))}
            {waitlist.length === 0 && <p style={{ fontSize: 12, color: 'var(--muted)' }}>No one waiting</p>}
          </div>
        </div>
      </div>
    </>
  )
}
