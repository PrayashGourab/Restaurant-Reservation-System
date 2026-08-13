-- ─────────────────────────────────────────────────────────────
--  DINE. Restaurant Reservation System — Database Setup
--  Run this entire file in MySQL Workbench once.
-- ─────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS mysql_rest;
USE mysql_rest;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  email    VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  phone    VARCHAR(30),
  role     VARCHAR(30) DEFAULT 'customer',
  joined   DATE DEFAULT (CURDATE())
);

-- Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  guest    VARCHAR(100) NOT NULL,
  guests   INT NOT NULL DEFAULT 1,
  date     VARCHAR(50),
  time     VARCHAR(50),
  table_id INT,
  notes    TEXT,
  status   VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Waitlist
CREATE TABLE IF NOT EXISTS waitlist (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  guests   INT NOT NULL DEFAULT 1,
  time     VARCHAR(50),
  phone    VARCHAR(30),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tables
CREATE TABLE IF NOT EXISTS tables (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  label    VARCHAR(20),
  seats    INT DEFAULT 4,
  status   VARCHAR(30) DEFAULT 'available',
  type     VARCHAR(30) DEFAULT 'standard'
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(200),
  message    TEXT,
  type       VARCHAR(30) DEFAULT 'info',
  is_read    TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Seed Data ────────────────────────────────────────────────

-- Admin user (login: admin@dine / admin123)
INSERT IGNORE INTO users (name, email, password, role) VALUES
  ('Admin', 'admin@dine', 'admin123', 'admin'),
  ('Sarah Johnson', 'sarah@dine.com', 'pass123', 'staff'),
  ('James Lee', 'james@email.com', 'pass123', 'customer');

-- Tables
INSERT IGNORE INTO tables (id, label, seats, status, type) VALUES
  (1, 'T1', 2, 'available', 'window'),
  (2, 'T2', 4, 'occupied',  'standard'),
  (3, 'T3', 4, 'available', 'standard'),
  (4, 'T4', 6, 'reserved',  'vip'),
  (5, 'T5', 2, 'available', 'outdoor'),
  (6, 'T6', 8, 'available', 'group'),
  (7, 'T7', 4, 'available', 'standard'),
  (8, 'T8', 4, 'occupied',  'window');

-- Sample reservations
INSERT IGNORE INTO reservations (guest, guests, date, time, table_id, status) VALUES
  ('Alice Brown',   2, '2026-06-05', '7:00 PM', 1, 'confirmed'),
  ('Bob Smith',     4, '2026-06-05', '7:30 PM', 2, 'pending'),
  ('Carol White',   6, '2026-06-06', '8:00 PM', 4, 'confirmed'),
  ('David Kim',     2, '2026-06-06', '6:30 PM', 5, 'pending'),
  ('Emma Davis',    3, '2026-06-07', '7:00 PM', 3, 'cancelled');

-- Sample waitlist
INSERT IGNORE INTO waitlist (name, guests, time) VALUES
  ('Frank Miller', 4, '7:00 PM'),
  ('Grace Liu',    2, '7:30 PM');

-- Sample notifications
INSERT IGNORE INTO notifications (title, message, type, is_read) VALUES
  ('New Reservation', 'Alice Brown booked Table 1 for tonight.', 'reservation', 0),
  ('Waitlist Update', 'Frank Miller joined the waitlist.', 'waitlist', 0),
  ('Cancellation', 'Emma Davis cancelled her reservation.', 'cancel', 1);
