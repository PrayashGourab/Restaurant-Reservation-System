# 🍽 Dine. — Restaurant Management System
## Complete Setup Guide

---

## 📁 Project Structure

```
dine-app/
├── backend/
│   ├── server.js       ← Express API
│   ├── db.js           ← MySQL connection
│   ├── package.json
│   └── setup.sql       ← Run this in MySQL Workbench first
├── src/
│   ├── components/
│   │   ├── AuthScreen.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Reservations.jsx
│   │   ├── TableMap.jsx
│   │   ├── Waitlist.jsx
│   │   ├── Analytics.jsx
│   │   ├── Customers.jsx
│   │   ├── Notifications.jsx
│   │   ├── NotifPanel.jsx
│   │   ├── Settings.jsx
│   │   └── ReservationModal.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

---

## ⚙️ STEP 1 — Database Setup (MySQL Workbench)

1. Open **MySQL Workbench**
2. Connect to your local instance
3. Open `backend/setup.sql`
4. Click the ⚡ lightning bolt to run it
5. This creates all tables and seeds the admin user

**Login credentials after setup:**
- Email: `admin@dine`
- Password: `admin123`

---

## 🔧 STEP 2 — Configure Your MySQL Password

Open `backend/server.js` and `backend/db.js`.

Find these lines and update with YOUR credentials:

```js
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'prayash',    // ← change if your password is different
  database: 'mysql_rest'  // ← change if you used a different name
}).promise();
```

---

## 📦 STEP 3 — Install Dependencies

Open VS Code terminal and run:

**Backend:**
```bash
cd backend
npm install
```

**Frontend (from main project folder):**
```bash
cd ..
npm install
```

---

## ▶️ STEP 4 — Run the App

You need TWO terminals open at the same time:

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
```
You should see:
```
✅ Backend running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```
You should see:
```
➜  Local:   http://localhost:5173/
```

Open http://localhost:5173 in your browser.

---

## 🔑 Login

- **Email:** `admin@dine`
- **Password:** `admin123`

---

## 📋 Pages

| Page          | Description                              |
|---------------|------------------------------------------|
| Dashboard     | Stats, recent reservations, peak hours   |
| Reservations  | Full list, filter, status update, delete |
| Table Map     | Visual table grid, click to toggle status|
| Waitlist      | Queue management, add/remove guests      |
| Analytics     | Charts, status breakdown, summary stats  |
| Customers     | All registered users                     |
| Notifications | All system notifications                 |
| Settings      | Profile info, change password            |

---

## ❗ Troubleshooting

| Problem | Fix |
|--------|-----|
| `Cannot connect to server` | Make sure `node server.js` is running in backend terminal |
| `Unknown database` | Run `setup.sql` in MySQL Workbench first |
| `Connection failed` | Check password in `db.js` matches your MySQL password |
| White/blank page | Open F12 → Console and check for errors |
| Login says invalid | Run `SELECT * FROM users;` in Workbench to verify admin exists |
