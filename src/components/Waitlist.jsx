export default function Waitlist({ waitlist, onRemove }) {
  return (
    <>
      <div className="stat-grid">
        {[
          { l: 'In Queue',             v: waitlist.length },
          { l: 'Avg Wait Time',        v: '35 min' },
          { l: 'Tables Freed Today',   v: 8 },
          { l: 'Served from Waitlist', v: 5 },
        ].map((s) => (
          <div key={s.l} className="stat-card">
            <div className="label">{s.l}</div>
            <div className="value">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="section-header">
        <h3>Current Queue</h3>
      </div>

      {waitlist.length === 0 && (
        <div className="empty">
          <i className="ti ti-mood-happy" />
          No one on the waitlist right now!
        </div>
      )}

      {waitlist.map((w, i) => (
        <div key={w.id} className="waitlist-item">
          <div className="wait-num">{i + 1}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 500 }}>{w.name}</p>
            <div style={{ display: 'flex', gap: '.5rem', fontSize: 11, color: 'var(--muted)', marginTop: 2, flexWrap: 'wrap' }}>
              <span><i className="ti ti-users" style={{ fontSize: 12 }} /> {w.guests} guests</span>
              <span><i className="ti ti-clock" style={{ fontSize: 12 }} /> Since {w.waitSince}</span>
              <span style={{ color: 'var(--accent)' }}>Est. {w.estWait}</span>
              {w.phone && <span>{w.phone}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '.4rem' }}>
            <button
              className="btn-sm"
              style={{ color: 'var(--green)', borderColor: 'var(--green)' }}
              onClick={() => onRemove(w.id)}
            >
              <i className="ti ti-armchair" style={{ fontSize: 12 }} /> Seat
            </button>
            <button
              className="btn-sm"
              style={{ color: 'var(--red)', borderColor: 'var(--red)' }}
              onClick={() => onRemove(w.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </>
  )
}
