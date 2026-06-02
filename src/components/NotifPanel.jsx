import { useState } from 'react'
import { NOTIFICATIONS } from '../data/seed'

export default function NotifPanel({ onClose }) {
  const [read, setRead] = useState([])

  function markRead(id) {
    setRead((prev) => [...prev, id])
  }

  return (
    <>
      <div className="notif-overlay" onClick={onClose} />
      <div className="notif-panel open">
        <div className="notif-header">
          <span style={{ fontSize: 14, fontWeight: 500 }}>Notifications</span>
          <button className="close-btn" onClick={onClose}>
            <i className="ti ti-x" />
          </button>
        </div>

        {NOTIFICATIONS.map((n) => (
          <div
            key={n.id}
            className={`notif-item${n.unread && !read.includes(n.id) ? ' unread' : ''}`}
            onClick={() => markRead(n.id)}
          >
            <p>{n.msg}</p>
            <span>{n.time}</span>
          </div>
        ))}
      </div>
    </>
  )
}
