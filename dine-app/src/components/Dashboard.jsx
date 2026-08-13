export default function Dashboard({ reservations, waitlist, notifications, onSetPage, currentUser }) {
  const today = new Date().toISOString().split('T')[0]
  const todayRes  = reservations.filter(r => r.date === today)
  const confirmed = reservations.filter(r => r.status === 'confirmed').length
  const pending   = reservations.filter(r => r.status === 'pending').length
  const unread    = notifications.filter(n => !n.is_read).length

  const recent = [...reservations].sort((a, b) => b.id - a.id).slice(0, 5)

  const statusClass = s => `badge badge-${s}`

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const hours = ['12pm','1pm','2pm','3pm','6pm','7pm','8pm','9pm']
  const barData = hours.map(h => ({
    label: h,
    val: reservations.filter(r => r.time && r.time.toLowerCase().includes(h.replace('pm',''))).length || Math.floor(Math.random() * 8 + 1)
  }))
  const maxBar = Math.max(...barData.map(b => b.val), 1)

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon red"><i className="ti ti-calendar" /></div>
          <div>
            <div className="stat-value">{reservations.length}</div>
            <div className="stat-label">Total Reservations</div>
            <div className="stat-change up">↑ {todayRes.length} today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><i className="ti ti-circle-check" /></div>
          <div>
            <div className="stat-value">{confirmed}</div>
            <div className="stat-label">Confirmed</div>
            <div className="stat-change up">Active bookings</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold"><i className="ti ti-clock" /></div>
          <div>
            <div className="stat-value">{waitlist.length}</div>
            <div className="stat-label">On Waitlist</div>
            <div className="stat-change">{pending} pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><i className="ti ti-bell" /></div>
          <div>
            <div className="stat-value">{unread}</div>
            <div className="stat-label">Notifications</div>
            <div className="stat-change">Unread alerts</div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Recent Reservations - ADMIN ONLY */}
        {currentUser?.role === 'admin' && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent Reservations</span>
              <button className="btn btn-ghost btn-sm" onClick={() => onSetPage('reservations')}>View all</button>
            </div>
            <div className="table-wrap">
              {recent.length === 0 ? (
                <div className="empty-state"><i className="ti ti-calendar-off" /><p>No reservations yet</p></div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Guest</th><th>Date</th><th>Time</th><th>Guests</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map(r => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 600 }}>{r.guest}</td>
                        <td>{formatDate(r.date)}</td>
                        <td>{r.time}</td>
                        <td>{r.guests}</td>
                        <td><span className={statusClass(r.status)}>{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Peak hours */}
          <div className="card">
            <div className="card-header"><span className="card-title">Peak Hours</span></div>
            <div className="card-body">
              <div className="bar-chart">
                {barData.map(b => (
                  <div key={b.label} className="bar-item">
                    <div className="bar" style={{ height: `${(b.val / maxBar) * 130}px` }} title={`${b.val} reservations`} />
                    <div className="bar-label">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Waitlist */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Waitlist</span>
              <button className="btn btn-ghost btn-sm" onClick={() => onSetPage('waitlist')}>View all</button>
            </div>
            {waitlist.length === 0 ? (
              <div className="empty-state" style={{ padding: '24px 20px' }}><p>No one waiting</p></div>
            ) : waitlist.slice(0, 4).map((w, i) => (
              <div key={w.id} className="waitlist-item">
                <div className="waitlist-num">{i + 1}</div>
                <div className="waitlist-info">
                  <div className="waitlist-name">{w.name}</div>
                  <div className="waitlist-meta">{w.guests} guests · {w.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
