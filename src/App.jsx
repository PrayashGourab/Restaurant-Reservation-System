import { useState, useEffect } from 'react'
import AuthScreen    from './components/AuthScreen'
import Sidebar       from './components/Sidebar'
import Dashboard     from './components/Dashboard'
import Reservations  from './components/Reservations'
import TableMap      from './components/TableMap'
import Waitlist      from './components/Waitlist'
import Analytics     from './components/Analytics'
import Customers     from './components/Customers'
import Settings      from './components/Settings'
import Notifications from './components/Notifications'
import NotifPanel    from './components/NotifPanel'
import ReservationModal from './components/ReservationModal'

const API = 'http://localhost:5000'

const PAGE_TITLES = {
  dashboard:     'Dashboard',
  reservations:  'Reservations',
  tables:        'Table Map',
  waitlist:      'Waitlist',
  analytics:     'Analytics',
  customers:     'Customers',
  notifications: 'Notifications',
  settings:      'Settings',
}

export default function App() {
  const [currentUser, setCurrentUser]     = useState(null)
  const [loginError,  setLoginError]      = useState('')
  const [page,        setPage]            = useState('dashboard')
  const [reservations, setReservations]   = useState([])
  const [waitlist,    setWaitlist]        = useState([])
  const [notifications, setNotifications] = useState([])
  const [notifOpen,   setNotifOpen]       = useState(false)
  const [showModal,   setShowModal]       = useState(false)
  const [loading,     setLoading]         = useState(false)

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'staff'

  function fetchAll() {
    fetch(`${API}/reservations`).then(r => r.json()).then(setReservations).catch(() => {})
    fetch(`${API}/waitlist`).then(r => r.json()).then(setWaitlist).catch(() => {})
    fetch(`${API}/notifications`).then(r => r.json()).then(setNotifications).catch(() => {})
  }

  useEffect(() => { if (currentUser) fetchAll() }, [currentUser])

  const unreadCount = notifications.filter(n => !n.is_read).length

  // ── Auth ─────────────────────────────────────────────────────
  async function handleLogin(email, password) {
    setLoading(true)
    try {
      const res  = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) { setCurrentUser(data.user); setLoginError('') }
      else setLoginError(data.error || 'Invalid email or password.')
    } catch {
      setLoginError('Cannot connect to server. Make sure backend is running.')
    }
    setLoading(false)
  }

  function handleLogout() { setCurrentUser(null); setPage('dashboard') }

  // ── Reservations ─────────────────────────────────────────────
  async function handleNewReservation(form) {
    try {
      await fetch(`${API}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      fetchAll()
    } catch { alert('Failed to save reservation.') }
  }

  async function handleUpdateStatus(id, status) {
    if (!isAdmin) return  // guard — only admin/staff
    try {
      await fetch(`${API}/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    } catch { alert('Failed to update status.') }
  }

  async function handleDeleteReservation(id) {
    if (!isAdmin) return  // guard — only admin/staff
    if (!confirm('Delete this reservation?')) return
    try {
      await fetch(`${API}/reservations/${id}`, { method: 'DELETE' })
      setReservations(prev => prev.filter(r => r.id !== id))
    } catch { alert('Failed to delete reservation.') }
  }

  // ── Waitlist ─────────────────────────────────────────────────
  async function handleRemoveWaitlist(id) {
    if (!isAdmin) return  // guard — only admin/staff
    try {
      await fetch(`${API}/waitlist/${id}`, { method: 'DELETE' })
      setWaitlist(prev => prev.filter(w => w.id !== id))
    } catch { alert('Failed to remove from waitlist.') }
  }

  // ── Notifications ─────────────────────────────────────────────
  async function handleMarkRead(id) {
    try {
      await fetch(`${API}/notifications/${id}/read`, { method: 'PUT' })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n))
    } catch {}
  }

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} loginError={loginError} loading={loading} />
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard reservations={reservations} waitlist={waitlist} notifications={notifications} onSetPage={setPage} />
      case 'reservations':
        return <Reservations reservations={reservations} currentUser={currentUser} isAdmin={isAdmin} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteReservation} onNew={() => setShowModal(true)} />
      case 'tables':
        return <TableMap isAdmin={isAdmin} />
      case 'waitlist':
        return <Waitlist waitlist={waitlist} isAdmin={isAdmin} onRemove={handleRemoveWaitlist} onRefresh={fetchAll} />
      case 'analytics':
        return <Analytics reservations={reservations} waitlist={waitlist} />
      case 'customers':
        return <Customers isAdmin={isAdmin} />
      case 'notifications':
        return <Notifications notifications={notifications} onMarkRead={handleMarkRead} />
      case 'settings':
        return <Settings currentUser={currentUser} />
      default:
        return <Dashboard reservations={reservations} waitlist={waitlist} notifications={notifications} onSetPage={setPage} />
    }
  }

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} currentUser={currentUser} onLogout={handleLogout} unreadCount={unreadCount} isAdmin={isAdmin} />

      <div className="main">
        <div className="topbar">
          <h2>{PAGE_TITLES[page]}</h2>
          <div className="topbar-right">
            <div style={{ position: 'relative' }}>
              <div className={`icon-btn${unreadCount > 0 ? ' badge-dot' : ''}`} onClick={() => setNotifOpen(true)} title="Notifications">
                <i className="ti ti-bell" />
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              <i className="ti ti-plus" style={{ fontSize: 14 }} /> New Reservation
            </button>
          </div>
        </div>

        <div className="content">{renderPage()}</div>
      </div>

      {notifOpen && (
        <NotifPanel notifications={notifications} onClose={() => setNotifOpen(false)} onMarkRead={handleMarkRead} />
      )}

      {showModal && (
        <ReservationModal onSave={handleNewReservation} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
