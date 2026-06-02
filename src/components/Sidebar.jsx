import { initials } from '../data/seed'

const NAV_ITEMS = [
  { id: 'dashboard',    icon: 'ti-layout-dashboard', label: 'Dashboard',    adminOnly: false },
  { id: 'reservations', icon: 'ti-calendar-event',   label: 'Reservations', adminOnly: false },
  { id: 'tables',       icon: 'ti-armchair',          label: 'Table Map',    adminOnly: false },
  { id: 'waitlist',     icon: 'ti-list-numbers',      label: 'Waitlist',     adminOnly: true  },
  { id: 'analytics',   icon: 'ti-chart-bar',          label: 'Analytics',    adminOnly: true  },
  { id: 'customers',   icon: 'ti-users',              label: 'Customers',    adminOnly: true  },
  { id: 'settings',    icon: 'ti-settings',           label: 'Settings',     adminOnly: false },
]

export default function Sidebar({ page, setPage, currentUser, onLogout }) {
  const isAdmin = currentUser.role === 'admin'
  const visibleItems = NAV_ITEMS.filter((n) => !n.adminOnly || isAdmin)

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>🍽 Dine</h1>
        <p>Reserve</p>
      </div>

      <nav className="nav">
        {isAdmin && (
          <div className="nav-section">Admin</div>
        )}
        {visibleItems.map((n) => (
          <div
            key={n.id}
            className={`nav-item${page === n.id ? ' active' : ''}`}
            onClick={() => setPage(n.id)}
            title={n.label}
          >
            <i className={`ti ${n.icon}`} />
            <span>{n.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="avatar">{initials(currentUser.name)}</div>
          <div className="user-info">
            <p>{currentUser.name}</p>
            <span>{currentUser.role}</span>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Sign out">
            <i className="ti ti-logout" />
          </button>
        </div>
      </div>
    </div>
  )
}
