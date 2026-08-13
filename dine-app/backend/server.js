require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).promise();

// Function to convert 12-hour to 24-hour format
function convertTo24Hour(time) {
  if (!time) return time;
  
  const [timePart, period] = time.split(/(am|pm)/i);
  let [hours, minutes] = timePart.trim().split(':');
  
  hours = parseInt(hours);
  minutes = minutes || '00';
  
  if (period.toLowerCase() === 'pm' && hours !== 12) {
    hours += 12;
  } else if (period.toLowerCase() === 'am' && hours === 12) {
    hours = 0;
  }
  
  return `${String(hours).padStart(2, '0')}:${minutes}:00`;
}

// Function to convert 24-hour to 12-hour format
function convertTo12Hour(time) {
  if (!time) return time;
  
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours);
  const period = hour >= 12 ? 'pm' : 'am';
  
  if (hour > 12) {
    hour -= 12;
  } else if (hour === 0) {
    hour = 12;
  }
  
  return `${hour}:${minutes}${period}`;
}

// ── Auth ──────────────────────────────────────────────────────
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid email or password.' });
    res.json({ success: true, user: rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email already registered.' });
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?,?,?,?,?)',
      [name, email, password, phone || null, 'customer']
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ error: 'Email not found.' });
    await db.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, email]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Reservations ──────────────────────────────────────────────
app.get('/reservations', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM reservations ORDER BY date DESC, time DESC');
    
    // Convert times back to 12-hour format for display
    const formattedRows = rows.map(row => ({
      ...row,
      time: convertTo12Hour(row.time)
    }));
    
    res.json(formattedRows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/reservations', async (req, res) => {
  try {
    let { guest, guests, date, time, table_id, notes, user_id } = req.body;
    
    // Validate required fields
    if (!guest || !guests || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields: guest, guests, date, time' });
    }

    // Convert 12-hour format (8:00pm) to 24-hour format (20:00:00) for storage
    const time24 = convertTo24Hour(time);

    const [result] = await db.query(
      'INSERT INTO reservations (guest, guests, date, time, table_id, notes, status, user_id) VALUES (?,?,?,?,?,?,?,?)',
      [guest, guests, date, time24, table_id || null, notes || null, 'pending', user_id || null]
    );

    // Notification for ADMIN (user_id IS NULL means all admins see it)
    try {
      await db.query(
        'INSERT INTO notifications (title, message, type, is_read, user_id) VALUES (?,?,?,0,NULL)',
        [
          'New Reservation',
          `${guest} requested a table for ${guests} guest(s) on ${date} at ${time}.`,
          'reservation'
        ]
      );
    } catch (notifErr) {
      console.error('Failed to create admin notification:', notifErr.message);
    }

    // Notification for CUSTOMER (specific to the user who made the reservation)
    if (user_id) {
      try {
        await db.query(
          'INSERT INTO notifications (title, message, type, is_read, user_id) VALUES (?,?,?,0,?)',
          [
            'Reservation Confirmed',
            `Your reservation for ${guests} guest(s) on ${date} at ${time} is pending confirmation.`,
            'reservation',
            user_id
          ]
        );
      } catch (notifErr) {
        console.error('Failed to create customer notification:', notifErr.message);
      }
    }

    res.json({ success: true, id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin only — update status
app.put('/reservations/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE reservations SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin only — delete reservation
app.delete('/reservations/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM reservations WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Waitlist ──────────────────────────────────────────────────
app.get('/waitlist', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM waitlist ORDER BY id ASC');
    
    // Convert times back to 12-hour format for display
    const formattedRows = rows.map(row => ({
      ...row,
      time: row.time ? convertTo12Hour(row.time) : null
    }));
    
    res.json(formattedRows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/waitlist', async (req, res) => {
  try {
    let { name, guests, time, phone } = req.body;
    
    // Convert time if provided
    let time24 = null;
    if (time) {
      time24 = convertTo24Hour(time);
    }
    
    const [result] = await db.query(
      'INSERT INTO waitlist (name, guests, time, phone, status) VALUES (?,?,?,?,?)',
      [name, guests, time24 || null, phone || null, 'waiting']
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin only — remove from waitlist
app.delete('/waitlist/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM waitlist WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Users / Customers ─────────────────────────────────────────
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, phone, role FROM users ORDER BY id DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Tables ────────────────────────────────────────────────────
app.get('/tables', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tables ORDER BY id ASC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin only — update table status
app.put('/tables/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE tables SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Notifications ─────────────────────────────────────────────
app.get('/notifications', async (req, res) => {
  try {
    const userId = req.query.user_id;
    let query = 'SELECT * FROM notifications WHERE 1=1';
    const params = [];

    // If user_id is provided, show:
    // 1. Notifications for that specific user
    // 2. Admin notifications (user_id IS NULL) — for admins to see all notifications
    if (userId) {
      query += ' AND (user_id = ? OR user_id IS NULL)';
      params.push(userId);
    }

    query += ' ORDER BY created_at DESC LIMIT 20';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/notifications/:id/read', async (req, res) => {
  try {
    await db.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(5000, () => console.log('✅ Backend running on http://localhost:5000'));