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
    // Force role to customer on register — admin must be set manually in DB
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
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/reservations', async (req, res) => {
  try {
    const { guest, guests, date, time, table_id, notes } = req.body;
    const [result] = await db.query(
      'INSERT INTO reservations (guest, guests, date, time, table_id, notes, status) VALUES (?,?,?,?,?,?,?)',
      [guest, guests, date, time, table_id || null, notes || null, 'pending']
    );
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
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/waitlist', async (req, res) => {
  try {
    const { name, guests, time, phone } = req.body;
    const [result] = await db.query(
      'INSERT INTO waitlist (name, guests, time, phone) VALUES (?,?,?,?)',
      [name, guests, time, phone || null]
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
    const [rows] = await db.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20');
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
