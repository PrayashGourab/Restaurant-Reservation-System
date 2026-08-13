import { useState } from 'react'

export default function ReservationModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    guest: '', guests: 2, date: '', time: '', table_id: '', notes: '', status: 'pending'
  })
  const [busy, setBusy] = useState(false)

  async function handleSave() {
    if (!form.guest || !form.date || !form.time) {
      alert('Please fill Guest Name, Date and Time.')
      return
    }
    setBusy(true)
    await onSave(form)
    setBusy(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">New Reservation</span>
          <button className="modal-close" onClick={onClose}><i className="ti ti-x" /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field" style={{ margin: 0, gridColumn: '1/-1' }}>
              <label>Guest Name *</label>
              <input placeholder="Full name" value={form.guest}
                onChange={e => setForm({ ...form, guest: e.target.value })} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Date *</label>
              <input type="date" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Time *</label>
              <input placeholder="e.g. 7:00 PM" value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Number of Guests</label>
              <input type="number" min={1} max={30} value={form.guests}
                onChange={e => setForm({ ...form, guests: +e.target.value })} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Table ID (optional)</label>
              <input type="number" placeholder="e.g. 3" value={form.table_id}
                onChange={e => setForm({ ...form, table_id: e.target.value })} />
            </div>
            <div className="field" style={{ margin: 0, gridColumn: '1/-1' }}>
              <label>Notes (optional)</label>
              <textarea placeholder="Any special requests…" value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })} style={{ minHeight: 70 }} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={busy}>
            {busy ? 'Saving…' : 'Save Reservation'}
          </button>
        </div>
      </div>
    </div>
  )
}