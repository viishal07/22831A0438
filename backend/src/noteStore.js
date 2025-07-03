const { v4: uuidv4 } = require('uuid');

const notes = {};

function isValidShortcode(code) {
  return /^[a-zA-Z0-9]{4,12}$/.test(code);
}

function addNote({ content, validity = 30, shortcode }) {
  const now = new Date();
  const expiry = new Date(now.getTime() + validity * 60000);
  if (!shortcode) {
    shortcode = uuidv4().slice(0, 6);
  }
  if (notes[shortcode]) {
    throw new Error('Shortcode already exists');
  }
  notes[shortcode] = {
    content,
    creationDate: now,
    expiryDate: expiry,
    totalViews: 0,
    views: [],
  };
  return { shortcode, expiry };
}

function getNote(shortcode) {
  return notes[shortcode];
}

function isExpired(shortcode) {
  const entry = notes[shortcode];
  if (!entry) return true;
  return new Date() > entry.expiryDate;
}

function recordView(shortcode, view) {
  if (notes[shortcode]) {
    notes[shortcode].totalViews++;
    notes[shortcode].views.push(view);
  }
}

function getAll() {
  return Object.entries(notes).map(([shortcode, data]) => ({ shortcode, ...data }));
}

function deleteNote(shortcode) {
  delete notes[shortcode];
}

module.exports = { addNote, getNote, isExpired, recordView, getAll, deleteNote, isValidShortcode }; 