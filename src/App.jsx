import { useState } from 'react'
import { INIT_USERS, INIT_RESERVATIONS, INIT_WAITLIST, NOTIFICATIONS, INIT_TABLES, initials } from './data/seed'

import AuthScreen       from './components/AuthScreen'
import Sidebar          from './components/Sidebar'
import Dashboard        from './components/Dashboard'
import Reservations     from './components/Reservations'
import TableMap         from './components/TableMap'
import Waitlist         from './components/Waitlist'
import Analytics        from './components/Analytics'
import Customers        from './components/Customers'
import Settings         from './components/Settings'
import NotifPanel       from './components/NotifPanel'
import ReservationModal from './components/ReservationModal'

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  reservations: 'Reservations',
  tables: 'Table Map',
  waitlist: 'Waitlist',
  analytics: 'Analytics',
  customers: 'Customers',
  settings: 'Settings',
}

export default function App() {
  // Auth state
  const [users, setUsers] = useState(INIT_USERS)
  const [currentUser, setCurrentUser] = useState(null)

  // App state
  const [page, setPage] = useState('dashboard')
  const [reservations, setReservations] = useState(INIT_RESERVATIONS)
  const [waitlist, setWaitlist] = useState(INIT_WAITLIST)
  const [notifOpen, setNotifOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length

  // ── Handlers ──────────────────────────────────────────────────
  function handleLogout() {
    setCurrentUser(null)
    setPage('dashboard')
  }

  function handleUpdateStatus(id, status) {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  function handleNewReservation(form) {
    // Auto-assign available table
    const TABLES = INIT_TABLES
    const avail = TABLES.find((t) => t.status === 'available' && t.seats >= form.guests)
    const nr = {
      id: reservations.length + 1,
      ...form,
      table: avail ? avail.id : null,
      status: 'pending',
    }
    setReservations((prev) => [...prev, nr])
  }

  function handleRemoveWaitlist(id) {
    setWaitlist((prev) => prev.filter((w) => w.id !== id))
  }

  // ── Auth gate ─────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <AuthScreen
        users={users}
        setUsers={setUsers}
        setCurrentUser={setCurrentUser}
      />
    )
  }

  // ── Page router ───────────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case 'dashboard':    return <Dashboard reservations={reservations} waitlist={waitlist} />
      case 'reservations': return <Reservations reservations={reservations} currentUser={currentUser} onUpdateStatus={handleUpdateStatus} />
      case 'tables':       return <TableMap />
      case 'waitlist':     return <Waitlist waitlist={waitlist} onRemove={handleRemoveWaitlist} />
      case 'analytics':    return <Analytics />
      case 'customers':    return <Customers users={users} />
      case 'settings':     return <Settings currentUser={currentUser} />
      default:             return <Dashboard reservations={reservations} waitlist={waitlist} />
    }
  }

  return (
    <div className="app">
      <Sidebar
        page={page}
        setPage={setPage}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="main">
        {/* Top bar */}
        <div className="topbar">
          <h2>{PAGE_TITLES[page]}</h2>
          <div className="topbar-right">
            <div className={unreadCount > 0 ? 'badge-dot' : ''}>
              <div className="icon-btn" onClick={() => setNotifOpen(true)} title="Notifications">
                <i className="ti ti-bell" />
              </div>
            </div>
            <button
              className="btn-sm btn-accent"
              style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}
              onClick={() => setShowModal(true)}
            >
              <i className="ti ti-plus" style={{ fontSize: 14 }} />
              New Reservation
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="content">
          {renderPage()}
        </div>
      </div>

      {/* Notifications panel */}
      {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} />}

      {/* New Reservation modal */}
      {showModal && (
        <ReservationModal
          onSave={handleNewReservation}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
