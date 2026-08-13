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

// Helper: today's date as YYYY-MM-DD (used when converting a walk-in waitlist entry into a reservation)
function todayISO() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
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
    // Fetch reservations
    fetch(`${API}/reservations`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setReservations(Array.isArray(data) ? data : []))
      .catch(() => {})

    // Fetch waitlist
    fetch(`${API}/waitlist`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setWaitlist(Array.isArray(data) ? data : []))
      .catch(() => {})

    // Fetch notifications with user_id if logged in
    let notificationsUrl = `${API}/notifications`
    if (currentUser?.id) {
      notificationsUrl += `?user_id=${currentUser.id}`
    }

    fetch(notificationsUrl)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {})
  }

  // Fetch on login, then keep polling so other sessions' changes show up
  useEffect(() => {
    if (!currentUser) return
    fetchAll()
    const interval = setInterval(fetchAll, 5000)
    return () => clearInterval(interval)
  }, [currentUser])

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
      if (data.success) {
        setCurrentUser(data.user)
        setLoginError('')
      }
      else setLoginError(data.error || 'Invalid email or password.')
    } catch {
      setLoginError('Cannot connect to server. Make sure backend is running.')
    }
    setLoading(false)
  }

  function handleLogout() {
    setCurrentUser(null)
    setPage('dashboard')
  }

  // ── Reservations ─────────────────────────────────────────────
  async function handleNewReservation(form) {
    try {
      const reservationData = {
        guest: form.guest,
        guests: form.guests,
        date: form.date,
        time: form.time,
        table_id: form.table_id || null,
        notes: form.notes || null,
        user_id: currentUser?.id || null  // IMPORTANT: Send user_id
      }

      const response = await fetch(`${API}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      })

      if (response.ok) {
        fetchAll()
        setShowModal(false)
      } else {
        alert('Failed to save reservation.')
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Failed to save reservation.')
    }
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

  // Confirm a pending reservation directly from the Waitlist page
  async function handleConfirmReservation(id) {
    if (!isAdmin) return
    await handleUpdateStatus(id, 'confirmed')
  }

  // Deny a pending reservation directly from the Waitlist page
  async function handleDenyReservation(id) {
    if (!isAdmin) return
    await handleUpdateStatus(id, 'cancelled')
  }

  // ── Waitlist ─────────────────────────────────────────────────
  async function handleRemoveWaitlist(id) {
    if (!isAdmin) return  // guard — only admin/staff
    try {
      await fetch(`${API}/waitlist/${id}`, { method: 'DELETE' })
      setWaitlist(prev => prev.filter(w => w.id !== id))
    } catch { alert('Failed to remove from waitlist.') }
  }

  // Confirm a walk-in waitlist entry: creates a new reservation from it, then removes the waitlist row
  async function handleConfirmWalkIn(entry) {
    if (!isAdmin) return
    try {
      const reservationData = {
        guest: entry.name,
        guests: entry.guests,
        date: todayISO(),
        time: entry.time || '7:00pm',
        table_id: null,
        notes: 'Converted from waitlist',
        user_id: null,
      }
      const response = await fetch(`${API}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      })
      if (!response.ok) { alert('Failed to create reservation from waitlist entry.'); return }

      await fetch(`${API}/waitlist/${entry.id}`, { method: 'DELETE' })
      fetchAll()
    } catch (err) {
      console.error('Error:', err)
      alert('Failed to confirm waitlist entry.')
    }
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
        return <Dashboard reservations={reservations} waitlist={waitlist} notifications={notifications} onSetPage={setPage} currentUser={currentUser} />
      case 'reservations':
        return <Reservations reservations={reservations} currentUser={currentUser} isAdmin={isAdmin} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteReservation} onNew={() => setShowModal(true)} />
      case 'tables':
        return <TableMap isAdmin={isAdmin} />
      case 'waitlist':
        return (
          <Waitlist
            waitlist={waitlist}
            reservations={reservations}
            currentUser={currentUser}
            onRemove={handleRemoveWaitlist}
            onConfirmReservation={handleConfirmReservation}
            onDenyReservation={handleDenyReservation}
            onConfirmWalkIn={handleConfirmWalkIn}
            onRefresh={fetchAll}
          />
        )
      case 'analytics':
        return <Analytics reservations={reservations} waitlist={waitlist} />
      case 'customers':
        return <Customers isAdmin={isAdmin} />
      case 'notifications':
        return <Notifications notifications={notifications} onMarkRead={handleMarkRead} />
      case 'settings':
        return <Settings currentUser={currentUser} />
      default:
        return <Dashboard reservations={reservations} waitlist={waitlist} notifications={notifications} onSetPage={setPage} currentUser={currentUser} />
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
