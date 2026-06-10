export default function Sidebar({ page, setPage, currentUser, onLogout, unreadCount, isAdmin }) {
  const initials = name => name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?'

  const mainNav = [
    { id: 'dashboard',    label: 'Dashboard',    icon: 'ti-layout-dashboard' },
    { id: 'reservations', label: 'Reservations', icon: 'ti-calendar' },
    { id: 'tables',       label: 'Table Map',    icon: 'ti-armchair' },
    { id: 'waitlist',     label: 'Waitlist',     icon: 'ti-clock' },
  ]

  // Analytics and Customers only visible to admin/staff
  const insightNav = [
    ...(isAdmin ? [
      { id: 'analytics', label: 'Analytics', icon: 'ti-chart-bar' },
      { id: 'customers', label: 'Customers', icon: 'ti-users' },
    ] : []),
    { id: 'notifications', label: 'Notifications', icon: 'ti-bell', badge: unreadCount },
    { id: 'settings',      label: 'Settings',      icon: 'ti-settings' },
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="brand">🍽 Dine<span>.</span></div>
        <div className="tagline">Restaurant Management</div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>
        {mainNav.map(item => (
          <div key={item.id} className={`nav-item${page === item.id ? ' active' : ''}`} onClick={() => setPage(item.id)}>
            <i className={`ti ${item.icon}`} />
            {item.label}
          </div>
        ))}
        <div className="nav-section-label" style={{ marginTop: 12 }}>Insights</div>
        {insightNav.map(item => (
          <div key={item.id} className={`nav-item${page === item.id ? ' active' : ''}`} onClick={() => setPage(item.id)}>
            <i className={`ti ${item.icon}`} />
            {item.label}
            {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
          </div>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">{initials(currentUser?.name || '')}</div>
        <div className="user-info">
          <div className="user-name">{currentUser?.name}</div>
          <div className="user-role">{currentUser?.role}</div>
        </div>
        <button className="logout-btn icon-btn" onClick={onLogout} title="Logout">
          <i className="ti ti-logout" />
        </button>
      </div>
    </div>
  )
}
