import { useState } from 'react'

const EMPTY = { name: '', phone: '', guests: 2, date: '', time: '', occasion: '', notes: '', preorder: '' }
const TODAY = new Date().toISOString().split('T')[0]

export default function ReservationModal({ onSave, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  function handleSave() {
    if (!form.name || !form.date || !form.time) {
      alert('Please fill Guest Name, Date, and Time.')
      return
    }
    onSave(form)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>New Reservation</h3>
          <button className="close-btn" onClick={onClose}><i className="ti ti-x" /></button>
        </div>

        <div className="modal-body">
          <div className="field-row">
            <div className="field">
              <label>Guest Name *</label>
              <input placeholder="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input placeholder="+880..." value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Date *</label>
              <input type="date" min={TODAY} value={form.date} onChange={(e) => set('date', e.target.value)} />
            </div>
            <div className="field">
              <label>Time *</label>
              <input type="time" value={form.time} onChange={(e) => set('time', e.target.value)} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Number of Guests</label>
              <select value={form.guests} onChange={(e) => set('guests', Number(e.target.value))}>
                {[1,2,3,4,5,6,7,8].map((n) => (
                  <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Occasion</label>
              <select value={form.occasion} onChange={(e) => set('occasion', e.target.value)}>
                <option value="">None</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="business">Business Dinner</option>
                <option value="date">Romantic Date</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Seating Preference</label>
            <select value={form.seating} onChange={(e) => set('seating', e.target.value)}>
              <option value="">No preference</option>
              <option value="window">Window seat</option>
              <option value="vip">VIP section</option>
              <option value="outdoor">Outdoor / Terrace</option>
              <option value="quiet">Quiet corner</option>
            </select>
          </div>

          <div className="field">
            <label>Special Requests / Dietary Needs</label>
            <input
              placeholder="e.g. Gluten-free, nut allergy, high chair needed…"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </div>

          <div className="field">
            <label>Pre-order (optional)</label>
            <input
              placeholder="e.g. Grilled Sea Bass × 2, Tiramisu × 1"
              value={form.preorder}
              onChange={(e) => set('preorder', e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn-sm btn-accent" onClick={handleSave}>Confirm Reservation</button>
        </div>
      </div>
    </div>
  )
}
