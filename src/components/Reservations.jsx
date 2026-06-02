import { useState } from 'react'
import { initials } from '../data/seed'

function ResRow({ r, isAdmin, onUpdateStatus }) {
  return (
    <div className="res-row">
      <div className="res-avatar">{initials(r.name)}</div>
      <div className="res-info">
        <div className="res-name">{r.name}</div>
        <div className="res-meta">
          <span>{r.date}</span>
          <span><i className="ti ti-clock" style={{ fontSize: 12 }} /> {r.time}</span>
          <span><i className="ti ti-users" style={{ fontSize: 12 }} /> {r.guests} guests</span>
          {r.table && <span>Table {r.table}</span>}
          {r.phone && <span>{r.phone}</span>}
          {r.notes && <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>{r.notes}</span>}
        </div>
      </div>
      <span className={`status-pill ${r.status}`}>{r.status}</span>

      {/* Admin-only action buttons */}
      {isAdmin && (
        <div className="res-actions">
          {r.status === 'pending' && (
            <button
              className="btn-sm"
              style={{ color: 'var(--green)', borderColor: 'var(--green)' }}
              onClick={() => onUpdateStatus(r.id, 'confirmed')}
            >
              Confirm
            </button>
          )}
          {r.status === 'confirmed' && (
            <button
              className="btn-sm"
              style={{ color: 'var(--blue)', borderColor: 'var(--blue)' }}
              onClick={() => onUpdateStatus(r.id, 'seated')}
            >
              Seat
            </button>
          )}
          {!['cancelled', 'seated'].includes(r.status) && (
            <button
              className="btn-sm"
              style={{ color: 'var(--red)', borderColor: 'var(--red)' }}
              onClick={() => onUpdateStatus(r.id, 'cancelled')}
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Customer can only cancel their own pending reservation */}
      {!isAdmin && r.status === 'pending' && (
        <div className="res-actions">
          <button
            className="btn-sm"
            style={{ color: 'var(--red)', borderColor: 'var(--red)' }}
            onClick={() => onUpdateStatus(r.id, 'cancelled')}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

const ADMIN_FILTERS = ['all', 'confirmed', 'pending', 'seated', 'cancelled']
const CUSTOMER_FILTERS = ['all', 'confirmed', 'pending', 'cancelled']

export default function Reservations({ reservations, currentUser, onUpdateStatus }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const isAdmin = currentUser.role === 'admin'

  // Customers only see their own reservations
  const userReservations = isAdmin
    ? reservations
    : reservations.filter((r) => r.name === currentUser.name || r.userId === currentUser.id)

  const filtered = userReservations
    .filter((r) => filter === 'all' || r.status === filter)
    .filter((r) =>
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.phone && r.phone.includes(search))
    )

  const filters = isAdmin ? ADMIN_FILTERS : CUSTOMER_FILTERS

  return (
    <>
      <div className="section-header" style={{ flexWrap: 'wrap', gap: '.5rem' }}>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
          {filters.map((f) => (
            <button
              key={f}
              className={`btn-sm${filter === f ? ' btn-accent' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        {isAdmin && (
          <div className="field" style={{ margin: 0, minWidth: 200 }}>
            <input
              placeholder="Search by name or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {!isAdmin && (
        <div style={{ background: 'rgba(201,169,110,.08)', border: '1px solid rgba(201,169,110,.2)', borderRadius: 8, padding: '.75rem 1rem', marginBottom: '1rem', fontSize: 13, color: 'var(--accent)' }}>
          <i className="ti ti-info-circle" style={{ marginRight: '.4rem' }} />
          Showing your reservations only. You can cancel a pending reservation.
        </div>
      )}

      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: '.75rem' }}>
        {filtered.length} reservation{filtered.length !== 1 ? 's' : ''} found
      </p>

      <div className="res-list">
        {filtered.map((r) => (
          <ResRow key={r.id} r={r} isAdmin={isAdmin} onUpdateStatus={onUpdateStatus} />
        ))}
        {filtered.length === 0 && (
          <div className="empty">
            <i className="ti ti-calendar-x" />
            No reservations found
          </div>
        )}
      </div>
    </>
  )
}
