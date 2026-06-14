const fs = require('fs');
const path = require('path');

const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data', 'db.json');
const dir = path.dirname(DB_FILE);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

let db = {
  sermons: [],
  announcements: [],
  contacts: []
};

if (fs.existsSync(DB_FILE)) {
  try {
    const loaded = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    db = {
      sermons: Array.isArray(loaded.sermons) ? loaded.sermons : [],
      announcements: Array.isArray(loaded.announcements) ? loaded.announcements : [],
      contacts: Array.isArray(loaded.contacts) ? loaded.contacts : []
    };
  } catch (error) {
    console.error('Failed to load DB file:', error);
  }
}

function save() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

function nextId(collection) {
  return collection.reduce((maxId, item) => Math.max(maxId, item.id || 0), 0) + 1;
}

module.exports = {
  getAllSermons() {
    return [...db.sermons].sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  getSermonById(id) {
    return db.sermons.find(item => item.id === Number(id));
  },
  createSermon({ title, slug, body, author, date, images, ad }) {
    const sermon = {
      id: nextId(db.sermons),
      title,
      slug,
      body,
      author,
      images: Array.isArray(images) ? images : (images ? String(images).split(',').map(s=>s.trim()).filter(Boolean) : []),
      ad: ad || null,
      date: date || new Date().toISOString()
    };
    db.sermons.push(sermon);
    save();
    return sermon;
  },
  updateSermon(id, { title, slug, body, author, date, images, ad }) {
    const sermon = db.sermons.find(item => item.id === Number(id));
    if (!sermon) return null;
    sermon.title = title;
    sermon.slug = slug;
    sermon.body = body;
    sermon.author = author;
    sermon.images = Array.isArray(images) ? images : (images ? String(images).split(',').map(s=>s.trim()).filter(Boolean) : sermon.images || []);
    sermon.ad = ad || sermon.ad || null;
    sermon.date = date || sermon.date;
    save();
    return sermon;
  },
  deleteSermon(id) {
    db.sermons = db.sermons.filter(item => item.id !== Number(id));
    save();
  },
  getAllAnnouncements() {
    return [...db.announcements].sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  getAnnouncementById(id) {
    return db.announcements.find(item => item.id === Number(id));
  },
  createAnnouncement({ title, content, date, active, address, checklist, images, ad }) {
    const ann = {
      id: nextId(db.announcements),
      title,
      content,
      address: address || null,
      checklist: Array.isArray(checklist) ? checklist : (checklist ? String(checklist).split('\n').map(s=>s.trim()).filter(Boolean) : []),
      images: Array.isArray(images) ? images : (images ? String(images).split(',').map(s=>s.trim()).filter(Boolean) : []),
      ad: ad || null,
      date: date || new Date().toISOString(),
      active: active ? 1 : 0
    };
    db.announcements.push(ann);
    save();
    return ann;
  },
  updateAnnouncement(id, { title, content, date, active, address, checklist, images, ad }) {
    const ann = db.announcements.find(item => item.id === Number(id));
    if (!ann) return null;
    ann.title = title;
    ann.content = content;
    ann.address = address || ann.address || null;
    ann.checklist = Array.isArray(checklist) ? checklist : (checklist ? String(checklist).split('\n').map(s=>s.trim()).filter(Boolean) : ann.checklist || []);
    ann.images = Array.isArray(images) ? images : (images ? String(images).split(',').map(s=>s.trim()).filter(Boolean) : ann.images || []);
    ann.ad = ad || ann.ad || null;
    ann.date = date || ann.date;
    ann.active = active ? 1 : 0;
    save();
    return ann;
  },
  deleteAnnouncement(id) {
    db.announcements = db.announcements.filter(item => item.id !== Number(id));
    save();
  },
  createContact({ name, email, message }) {
    const contact = {
      id: nextId(db.contacts),
      name,
      email,
      message,
      date: new Date().toISOString()
    };
    db.contacts.push(contact);
    save();
    return contact;
  }
};
