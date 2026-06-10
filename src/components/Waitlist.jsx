import { useState } from 'react'

const API = 'http://localhost:5000'

export default function Waitlist({ waitlist, isAdmin, onRemove, onRefresh }) {
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm]       = useState({ name: '', guests: 2, time: '', phone: '' })
  const [busy, setBusy]       = useState(false)

  async function handleAdd() {
    if (!form.name || !form.time) { alert('Please fill name and time.'); return }
    setBusy(true)
    try {
      await fetch(`${API}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setForm({ name: '', guests: 2, time: '', phone: '' })
      setShowAdd(false)
      onRefresh()
    } catch { alert('Failed to add to waitlist.') }
    setBusy(false)
  }

  return (
    <div>
      <div className="page-header">
        <div className="card-title" style={{ fontSize: 18 }}>Waitlist ({waitlist.length})</div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(s => !s)}>
          <i className="ti ti-plus" /> Add to Waitlist
        </button>
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header"><span className="card-title">Add Guest to Waitlist</span></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field" style={{ margin: 0 }}>
                <label>Guest Name *</label>
                <input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Phone</label>
                <input placeholder="Optional" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Guests *</label>
                <input type="number" min={1} max={20} value={form.guests} onChange={e => setForm({ ...form, guests: +e.target.value })} />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Preferred Time *</label>
                <input placeholder="e.g. 7:00 PM" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={busy}>
                {busy ? 'Adding…' : 'Add to Waitlist'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {waitlist.length === 0 ? (
          <div className="empty-state"><i className="ti ti-clock-off" /><p>No one on the waitlist</p></div>
        ) : waitlist.map((w, i) => (
          <div key={w.id} className="waitlist-item">
            <div className="waitlist-num">{i + 1}</div>
            <div className="waitlist-info">
              <div className="waitlist-name">{w.name}</div>
              <div className="waitlist-meta">
                {w.guests} guest{w.guests !== 1 ? 's' : ''} · {w.time}
                {w.phone && ` · ${w.phone}`}
              </div>
            </div>
            {/* Only admin/staff can remove from waitlist */}
            {isAdmin && (
              <button className="btn btn-danger btn-sm btn-icon" onClick={() => onRemove(w.id)} title="Remove">
                <i className="ti ti-x" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
