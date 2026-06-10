export default function Notifications({ notifications, onMarkRead }) {
  const unread = notifications.filter(n => !n.is_read).length

  const typeIcon = {
    reservation: 'ti-calendar',
    waitlist:    'ti-clock',
    cancel:      'ti-x',
    info:        'ti-info-circle',
  }

  function timeAgo(ts) {
    if (!ts) return ''
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
    if (diff < 60)   return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div>
      <div className="page-header">
        <div className="card-title" style={{ fontSize: 18 }}>
          Notifications {unread > 0 && <span className="nav-badge" style={{ marginLeft: 8 }}>{unread} new</span>}
        </div>
      </div>

      <div className="card">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <i className="ti ti-bell-off" />
            <p>No notifications yet</p>
          </div>
        ) : notifications.map(n => (
          <div
            key={n.id}
            className={`notif-item${!n.is_read ? ' unread' : ''}`}
            onClick={() => !n.is_read && onMarkRead(n.id)}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: n.is_read ? 'var(--cream)' : 'rgba(139,26,26,.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: n.is_read ? 'var(--text-light)' : 'var(--red)',
              fontSize: 18,
            }}>
              <i className={`ti ${typeIcon[n.type] || 'ti-bell'}`} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="notif-item-title">{n.title}</div>
              <div className="notif-item-msg">{n.message}</div>
              <div className="notif-time">{timeAgo(n.created_at)}</div>
            </div>
            {!n.is_read && (
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', flexShrink: 0, marginTop: 6 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
