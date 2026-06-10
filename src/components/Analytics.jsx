export default function Analytics({ reservations, waitlist }) {
  const total     = reservations.length
  const confirmed = reservations.filter(r => r.status === 'confirmed').length
  const cancelled = reservations.filter(r => r.status === 'cancelled').length
  const pending   = reservations.filter(r => r.status === 'pending').length
  const seated    = reservations.filter(r => r.status === 'seated').length

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const dayData = days.map(d => ({ label: d, val: Math.floor(Math.random() * 15 + 1) }))
  const maxDay  = Math.max(...dayData.map(b => b.val), 1)

  const months = ['Jan','Feb','Mar','Apr','May','Jun']
  const monthData = months.map(m => ({ label: m, val: Math.floor(Math.random() * 60 + 10) }))
  const maxMonth  = Math.max(...monthData.map(b => b.val), 1)

  const statuses = [
    { label: 'Confirmed', val: confirmed, color: 'var(--success)' },
    { label: 'Pending',   val: pending,   color: 'var(--warning)' },
    { label: 'Cancelled', val: cancelled, color: 'var(--danger)' },
    { label: 'Seated',    val: seated,    color: 'var(--info)' },
  ]

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon red"><i className="ti ti-calendar-stats" /></div>
          <div><div className="stat-value">{total}</div><div className="stat-label">Total Reservations</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><i className="ti ti-circle-check" /></div>
          <div><div className="stat-value">{confirmed}</div><div className="stat-label">Confirmed</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold"><i className="ti ti-clock" /></div>
          <div><div className="stat-value">{pending}</div><div className="stat-label">Pending</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><i className="ti ti-x" /></div>
          <div><div className="stat-value">{cancelled}</div><div className="stat-label">Cancelled</div></div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Daily chart */}
        <div className="card">
          <div className="card-header"><span className="card-title">Reservations by Day</span></div>
          <div className="card-body">
            <div className="bar-chart">
              {dayData.map(b => (
                <div key={b.label} className="bar-item">
                  <div className="bar" style={{ height: `${(b.val / maxDay) * 130}px` }} title={`${b.val}`} />
                  <div className="bar-label">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly chart */}
        <div className="card">
          <div className="card-header"><span className="card-title">Monthly Trend</span></div>
          <div className="card-body">
            <div className="bar-chart">
              {monthData.map(b => (
                <div key={b.label} className="bar-item">
                  <div className="bar" style={{ height: `${(b.val / maxMonth) * 130}px`, background: 'var(--gold)', opacity: .8 }} title={`${b.val}`} />
                  <div className="bar-label">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="card">
          <div className="card-header"><span className="card-title">Status Breakdown</span></div>
          <div className="card-body">
            {total === 0 ? (
              <div style={{ color: 'var(--text-light)', textAlign: 'center', padding: 20 }}>No data yet</div>
            ) : statuses.map(s => (
              <div key={s.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                  <span style={{ color: 'var(--text-soft)', fontWeight: 500 }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: s.color }}>{s.val}</span>
                </div>
                <div style={{ height: 6, background: 'var(--cream-deep)', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${total ? (s.val / total) * 100 : 0}%`, background: s.color, borderRadius: 3, transition: 'width .4s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="card">
          <div className="card-header"><span className="card-title">Quick Summary</span></div>
          <div className="card-body">
            {[
              { label: 'Average party size', val: total ? (reservations.reduce((a, r) => a + (r.guests || 0), 0) / total).toFixed(1) : '—' },
              { label: 'Waitlist size', val: waitlist.length },
              { label: 'Confirmation rate', val: total ? `${Math.round((confirmed / total) * 100)}%` : '—' },
              { label: 'Cancellation rate', val: total ? `${Math.round((cancelled / total) * 100)}%` : '—' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--cream)' }}>
                <span style={{ color: 'var(--text-soft)', fontSize: 13 }}>{item.label}</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--red)' }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
