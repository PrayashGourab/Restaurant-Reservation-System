export default function NotifPanel({ notifications, onClose, onMarkRead }) {
  const typeIcon = {
    reservation: 'ti-calendar',
    waitlist:    'ti-clock',
    cancel:      'ti-x',
    info:        'ti-info-circle',
  }

  function timeAgo(ts) {
    if (!ts) return ''
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
    if (diff < 60)    return 'just now'
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,24,16,.3)', zIndex: 899 }} onClick={onClose} />
      <div className="notif-panel">
        <div className="notif-header">
          <span className="notif-title">Notifications</span>
          <button className="icon-btn" onClick={onClose}><i className="ti ti-x" /></button>
        </div>
        <div className="notif-list">
          {notifications.length === 0 ? (
            <div className="empty-state" style={{ padding: 40 }}>
              <i className="ti ti-bell-off" />
              <p>No notifications</p>
            </div>
          ) : notifications.map(n => (
            <div
              key={n.id}
              className={`notif-item${!n.is_read ? ' unread' : ''}`}
              onClick={() => !n.is_read && onMarkRead(n.id)}
            >
              <div className={`notif-dot${n.is_read ? ' read' : ''}`} />
              <div style={{ flex: 1 }}>
                <div className="notif-item-title">{n.title}</div>
                <div className="notif-item-msg">{n.message}</div>
                <div className="notif-time">{timeAgo(n.created_at)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
