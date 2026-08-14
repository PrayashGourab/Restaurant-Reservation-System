# 🚀 DINE — Restaurant Reservation Management System

---

## 📌 Overview

**DINE** is a full-stack restaurant reservation management system for restaurants to manage bookings, tables, walk-ins, and staff notifications. It includes a complete reservation flow, table map, waitlist system, role-based admin panel, and analytics dashboard — all built on React, Node.js/Express, and MySQL.

---

## 👥 Group Details

- **Group Number:** 7
- **Batch:** 61st (G)
- **Department:** Computer Science and Engineering, Metropolitan University
- **Supervisor:** Md. Fahmidur Rahman Sakib, Lecturer, Dept. of CSE

### 🧑‍🤝‍🧑 Team Members

| Name | ID | Contribution |
|---|---|---|
| Sabbir Ahmed Rimon | 242-115-307 | Frontend Development — UI/UX design, React component development, system integration |
| Samiha Mahjabin | 242-115-308 | Database Design — ER diagram, schema normalization, SQL queries |
| Gourab Chakrabarty | 242-115-324 | Backend Development — API design, authentication, role-based access control |
| Adrita Chakrabarty | 242-115-326 | Project Coordination — documentation, testing, system integration |

---

## 🎯 Objective

Restaurants often manage reservations, walk-ins, and table availability manually or across disconnected tools, leading to double bookings, missed walk-ins, and no real-time visibility for staff. **DINE** solves this by providing a dedicated, database-driven reservation management system where staff can create and track reservations, manage table status, convert walk-ins from a waitlist into reservations, and receive live notifications — all in one place.

---

## ✨ Features

- ✅ User registration, login, and role-based access control (`admin` / `staff` / `customer`)
- ✅ Password reset flow
- ✅ Reservation creation, viewing, updating, and cancellation with status tracking (`pending`, `confirmed`, `cancelled`)
- ✅ Reservation-to-table assignment
- ✅ Table map with live status (available / occupied / reserved) and table type (window, outdoor, VIP, group, standard)
- ✅ Waitlist system for walk-in guests, with direct conversion of a waitlist entry into a confirmed reservation
- ✅ Notification feed for new reservations, waitlist joins, and cancellations, with read/unread tracking per user
- ✅ Polling-based live updates so staff see new reservations/waitlist entries without a manual refresh
- ✅ Analytics dashboard for reservation trends and table occupancy
- ✅ Customer list view
- ✅ Admin settings panel

---

## 🖼️ Project Preview

### 🔹 UI Screenshots

![Screenshot](https://raw.githubusercontent.com/PrayashGourab/Restaurant-Reservation-System/main/uploads/ui.png)

![Screenshot](https://raw.githubusercontent.com/PrayashGourab/Restaurant-Reservation-System/main/uploads/ui1.png)

![Screenshot](https://raw.githubusercontent.com/PrayashGourab/Restaurant-Reservation-System/main/uploads/ui2.png)

![Screenshot](https://raw.githubusercontent.com/PrayashGourab/Restaurant-Reservation-System/main/uploads/ui3.png)

### 🔹 ER Diagram

![ER Diagram](https://raw.githubusercontent.com/PrayashGourab/Restaurant-Reservation-System/main/uploads/ER%20diagram.png)

---

## 🏗️ Tech Stack

**Frontend:** Built with **React (Vite)**, giving a fast dev environment and component-based UI for the dashboard, reservation modal, table map, waitlist, and notification panel. Runs on **`http://localhost:5173`**.

**Backend:** Built with **Node.js and Express**, handling server-side logic such as authentication, reservation and waitlist CRUD operations, table status updates, and notification delivery. Runs on **`http://localhost:5000`**.

**Database:** **MySQL** database named `Dine`, consisting of 5 tables — `users`, `reservations`, `tables`, `waitlist`, and `notifications`. Reservations reference both a user and a table via `user_id` and `table_id` foreign keys, and a waitlist entry can become a reservation. The schema is seeded with sample users, tables, reservations, waitlist entries, and notifications for demonstration.

---

## ⚙️ Installation & Setup

Clone the repository

```bash
git clone https://github.com/PrayashGourab/Restaurant-Reservation-System.git
cd dine-app
```

### Terminal 1: Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend` with your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=Dine
```

Import the database:
- Open MySQL Workbench -> run `backend/setup.sql`
- This creates the "Dine" database, tables, and seed data

```bash
npm start
```

Runs on `http://localhost:5000`

### Terminal 2: Frontend

```bash
cd dine-app
npm install
npm run dev
```

Runs on `http://localhost:5173`

Open the app in your browser: `http://localhost:5173`

---

## 🗂️ Project Structure

```
dine-app/
│
├── backend/
│   ├── db.js                  # MySQL connection config
│   ├── server.js              # Express server & all API routes
│   ├── setup.sql              # Database schema & seed data
│   └── package.json
│
├── src/
│   ├── components/
│   │   ├── AuthScreen.jsx     # Login / register / password reset
│   │   ├── Dashboard.jsx      # Overview dashboard
│   │   ├── Reservations.jsx   # Reservation list & management
│   │   ├── ReservationModal.jsx # Create/edit reservation form
│   │   ├── TableMap.jsx       # Table status map
│   │   ├── Waitlist.jsx       # Walk-in waitlist management
│   │   ├── Analytics.jsx      # Reservation trend analytics
│   │   ├── Customers.jsx      # Customer list view
│   │   ├── Notifications.jsx  # Notification feed
│   │   ├── NotifPanel.jsx     # Notification dropdown panel
│   │   ├── Settings.jsx       # Admin settings
│   │   └── Sidebar.jsx        # Navigation sidebar
│   ├── App.jsx                # Main app logic, routing, polling
│   ├── main.jsx                # React entry point
│   └── index.css              # Global styles
│
├── uploads/                    # README screenshots & ER diagram
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🎥 Demo Video

👉 [Watch Project Demo](#) *( https://youtu.be/INQzwqXUKF0?si=GMXHa_ZyrC0FwxCY)*

The video covers:
- A full walkthrough of all functionalities listed above
- A brief explanation of the frontend (React component structure and UI flow)
- A detailed explanation of the backend and the database queries behind each API endpoint

---

## Default Login (seeded)

- **Admin:** `admin@dine` / `admin123``
- **Customer:** `gourab4@.com` / `000000`
