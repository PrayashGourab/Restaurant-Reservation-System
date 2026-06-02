// ── Initial seed data ──────────────────────────────────────────

export const INIT_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@dine.com',
    password: 'admin123',
    role: 'admin',
    phone: '+880 171 000 0001',
    prefs: { allergen: [], seating: 'window', occasion: '' },
    visits: 12,
    joined: '2024-01-15',
  },
]

export const INIT_RESERVATIONS = [
  { id: 1, name: 'Fatima Chowdhury', phone: '+880 171 234 5678', guests: 4, date: '2026-05-30', time: '19:00', table: 3,  status: 'confirmed', notes: 'Birthday celebration', preorder: '', occasion: 'birthday' },
  { id: 2, name: 'Karim Uddin',      phone: '+880 181 234 5678', guests: 2, date: '2026-05-30', time: '19:30', table: 7,  status: 'pending',   notes: 'Anniversary',         preorder: '', occasion: 'anniversary' },
  { id: 3, name: 'Nusrat Jahan',     phone: '+880 191 234 5678', guests: 6, date: '2026-05-30', time: '20:00', table: 12, status: 'confirmed', notes: 'Office dinner',        preorder: '', occasion: '' },
  { id: 4, name: 'Rashed Khan',      phone: '+880 171 999 8877', guests: 2, date: '2026-05-30', time: '20:30', table: 5,  status: 'seated',    notes: '',                    preorder: '', occasion: '' },
  { id: 5, name: 'Sonia Begum',      phone: '+880 181 555 6677', guests: 3, date: '2026-05-31', time: '18:30', table: 2,  status: 'confirmed', notes: 'Gluten-free required', preorder: '', occasion: '' },
]

export const INIT_WAITLIST = [
  { id: 1, name: 'Asif Rahman',  guests: 4, phone: '+880 171 777 8899', waitSince: '18:45', estWait: '20 min' },
  { id: 2, name: 'Priya Sen',    guests: 2, phone: '+880 181 333 4455', waitSince: '19:10', estWait: '35 min' },
  { id: 3, name: 'Omar Hossain', guests: 5, phone: '+880 191 666 7788', waitSince: '19:25', estWait: '50 min' },
]

export const NOTIFICATIONS = [
  { id: 1, msg: 'New reservation: Fatima Chowdhury — Table 3, 7:00 PM', time: '5 min ago',  unread: true },
  { id: 2, msg: 'Waitlist: Asif Rahman added to queue',                  time: '12 min ago', unread: true },
  { id: 3, msg: 'Reservation #2 pending approval',                       time: '25 min ago', unread: true },
  { id: 4, msg: 'Table 8 now available',                                 time: '1 hr ago',   unread: false },
  { id: 5, msg: 'Peak hour alert: 7–9 PM fully booked',                 time: '2 hr ago',   unread: false },
]

export const INIT_TABLES = Array.from({ length: 15 }, (_, i) => {
  const id = i + 1
  const status = [3, 5, 7, 12].includes(id)
    ? 'reserved'
    : [2, 6, 10].includes(id)
    ? 'occupied'
    : 'available'
  const seats = id <= 5 ? 2 : id <= 10 ? 4 : 6
  return { id, status, seats }
})

export const ANALYTICS = {
  busyHours: ['12PM', '1PM', '6PM', '7PM', '8PM', '9PM', '10PM'],
  busyVals:  [45, 60, 55, 90, 100, 85, 40],
  tables:    [
    { t: 'Table 3',  v: 89 },
    { t: 'Table 7',  v: 76 },
    { t: 'Table 12', v: 71 },
    { t: 'Table 5',  v: 65 },
    { t: 'Table 1',  v: 55 },
  ],
  meals: [
    { m: 'Grilled Sea Bass',   v: 95 },
    { m: 'Beef Tenderloin',    v: 88 },
    { m: 'Pasta Carbonara',    v: 79 },
    { m: 'Mushroom Risotto',   v: 67 },
    { m: 'Tiramisu',           v: 61 },
  ],
  weekly: [42, 58, 65, 80, 95, 110, 88],
}

// Helper
export const initials = (name) =>
  name.split(' ').map((x) => x[0]).join('').toUpperCase().slice(0, 2)
