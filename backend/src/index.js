const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const logger = require('./logger');
const {
  addNote,
  getNote,
  isExpired,
  recordView,
  getAll,
  deleteNote,
  isValidShortcode
} = require('./noteStore');

const app = express();
const PORT = 5000;
const HOST = `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());
app.use(logger);

// Create Note
app.post('/notes', (req, res) => {
  const { content, validity, shortcode } = req.body;
  if (!content || typeof content !== 'string' || content.length < 1) {
    return res.status(400).json({ error: 'Content is required' });
  }
  if (shortcode && !isValidShortcode(shortcode)) {
    return res.status(400).json({ error: 'Invalid shortcode (alphanumeric, 4-12 chars)' });
  }
  try {
    const { shortcode: code, expiry } = addNote({ content, validity, shortcode });
    return res.status(201).json({
      noteLink: `${HOST}/${code}`,
      expiry: expiry.toISOString(),
    });
  } catch (e) {
    return res.status(409).json({ error: e.message });
  }
});

// View Note (and record view)
app.get('/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  const entry = getNote(shortcode);
  if (!entry || isExpired(shortcode)) {
    return res.status(404).send('Note not found or expired');
  }
  // Record view
  let location = 'Unknown';
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = await axios.get(`https://ipapi.co/${ip}/country_name/`).then(r => r.data).catch(() => 'Unknown');
    location = geo;
  } catch {}
  recordView(shortcode, {
    timestamp: new Date().toISOString(),
    source: req.get('referer') || '',
    location,
  });
  res.json({ content: entry.content });
});

// Retrieve Note Statistics
app.get('/notes/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  const entry = getNote(shortcode);
  if (!entry) {
    return res.status(404).json({ error: 'Note not found' });
  }
  return res.json({
    totalViews: entry.totalViews,
    content: entry.content,
    creationDate: entry.creationDate,
    expiryDate: entry.expiryDate,
    views: entry.views,
  });
});

// List all notes
app.get('/notes', (req, res) => {
  return res.json(getAll());
});

// Delete note
app.delete('/notes/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  if (!getNote(shortcode)) {
    return res.status(404).json({ error: 'Note not found' });
  }
  deleteNote(shortcode);
  res.status(204).send();
});

app.listen(PORT, () => {
  // No console.log per requirements
}); 