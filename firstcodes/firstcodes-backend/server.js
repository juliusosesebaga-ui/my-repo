require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'changeme';
const ADMIN_USER = process.env.ADMIN_USER || 'custodian';
const ADMIN_PASS = process.env.ADMIN_PASS || 'custoelite123';

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Serve admin static UI
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));

// Serve the landing page and front-end assets from the parent `firstcodes` folder
app.use(express.static(path.join(__dirname, '..')));

// Simple token check middleware for admin endpoints
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token || token !== ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// Admin login middleware
function requireAdminCredentials(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password || username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ---------- SERMONS API ----------
app.get('/api/sermons', (req, res) => {
  res.json(db.getAllSermons());
});

app.get('/api/sermons/:id', (req, res) => {
  const sermon = db.getSermonById(req.params.id);
  if (!sermon) return res.status(404).json({ error: 'Not found' });
  res.json(sermon);
});

app.post('/api/sermons', requireAdmin, (req, res) => {
  const sermon = db.createSermon(req.body);
  res.json(sermon);
});

app.put('/api/sermons/:id', requireAdmin, (req, res) => {
  const sermon = db.updateSermon(req.params.id, req.body);
  if (!sermon) return res.status(404).json({ error: 'Not found' });
  res.json(sermon);
});

app.delete('/api/sermons/:id', requireAdmin, (req, res) => {
  db.deleteSermon(req.params.id);
  res.json({ ok: true });
});

// ---------- ANNOUNCEMENTS API ----------
app.get('/api/announcements', (req, res) => {
  res.json(db.getAllAnnouncements());
});

app.post('/api/announcements', requireAdmin, (req, res) => {
  const announcement = db.createAnnouncement(req.body);
  res.json(announcement);
});

app.put('/api/announcements/:id', requireAdmin, (req, res) => {
  const announcement = db.updateAnnouncement(req.params.id, req.body);
  if (!announcement) return res.status(404).json({ error: 'Not found' });
  res.json(announcement);
});

app.delete('/api/announcements/:id', requireAdmin, (req, res) => {
  db.deleteAnnouncement(req.params.id);
  res.json({ ok: true });
});

// ---------- CONTACT FORM ----------
app.post('/api/contact', (req, res) => {
  const contact = db.createContact(req.body);
  res.json({ ok: true, id: contact.id });
});

// Admin login endpoint
app.post('/api/admin/login', requireAdminCredentials, (req, res) => {
  res.json({ ok: true, token: ADMIN_TOKEN });
});

app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({ ok: true, user: ADMIN_USER });
});

// Simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Fallback to frontend app for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
