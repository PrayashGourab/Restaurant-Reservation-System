import { ANALYTICS } from '../data/seed'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MAX_WEEKLY = Math.max(...ANALYTICS.weekly)

export default function Analytics() {
  return (
    <>
      <div className="stat-grid">
        {[
          { l: 'Total Reservations', v: '1,284', sub: 'This month' },
          { l: 'Avg Party Size',     v: '3.2',   sub: 'Guests per booking' },
          { l: 'No-show Rate',       v: '4.1%',  sub: '↓ 1.2% from last month' },
          { l: 'Est. Revenue',       v: '৳284K', sub: 'This month' },
        ].map((s) => (
          <div key={s.l} className="stat-card">
            <div className="label">{s.l}</div>
            <div className="value">{s.v}</div>
            <div className="sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: 14, marginBottom: '.75rem' }}>Weekly Reservation Trend</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
          {ANALYTICS.weekly.map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>{v}</span>
              <div
                style={{
                  width: '100%',
                  height: `${(v / MAX_WEEKLY) * 80}px`,
                  background: i === 5 || i === 6 ? 'var(--accent)' : 'var(--card2)',
                  borderRadius: '4px 4px 0 0',
                  border: '1px solid var(--border)',
                }}
              />
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>{DAYS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <h3 style={{ fontSize: 14, marginBottom: '.75rem' }}>Most Booked Tables</h3>
          {ANALYTICS.tables.map((t) => (
            <div key={t.t} className="bar-row">
              <span className="bar-label">{t.t}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${t.v}%` }} />
              </div>
              <span className="bar-val">{t.v}%</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3 style={{ fontSize: 14, marginBottom: '.75rem' }}>Popular Pre-orders</h3>
          {ANALYTICS.meals.map((m) => (
            <div key={m.m} className="bar-row">
              <span className="bar-label" style={{ width: 110 }}>{m.m.length > 14 ? m.m.slice(0, 14) + '…' : m.m}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${m.v}%`, background: 'var(--orange)' }} />
              </div>
              <span className="bar-val">{m.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel" style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: 14, marginBottom: '.75rem' }}>Customer Revisit Rate</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { l: 'First-time visitors', v: 44, c: 'var(--blue)' },
            { l: 'Returning (2–5x)',     v: 38, c: 'var(--accent)' },
            { l: 'Loyal (5x+)',          v: 18, c: 'var(--green)' },
          ].map((s) => (
            <div key={s.l} style={{ flex: 1, minWidth: 120 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: 'var(--muted)' }}>{s.l}</span>
                <span style={{ color: s.c, fontWeight: 500 }}>{s.v}%</span>
              </div>
              <div className="bar-track" style={{ height: 10 }}>
                <div className="bar-fill" style={{ width: `${s.v}%`, background: s.c }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
