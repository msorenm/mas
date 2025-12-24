
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // نیاز به نصب: npm install uuid

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup (SQLite)
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Materials
    db.run(`CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Drivers
    db.run(`CREATE TABLE IF NOT EXISTS drivers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      default_plate TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Suppliers
    db.run(`CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Projects
    db.run(`CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Users
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    // Admin user default
    db.run(`INSERT OR IGNORE INTO users (id, name, username, role) VALUES ('${uuidv4()}', 'مدیر سیستم', 'admin', 'SUPER_ADMIN')`);

    // Announcements
    db.run(`CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT,
      date TEXT,
      target_roles TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Entries
    db.run(`CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      material_id TEXT,
      driver_id TEXT,
      plate_number TEXT,
      supplier_id TEXT,
      project_id TEXT,
      tonnage REAL,
      quantity REAL,
      unit TEXT,
      entry_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Settings
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      company_name TEXT,
      logo_url TEXT,
      invoice_primary_color TEXT,
      header_text TEXT,
      footer_text TEXT,
      contact_info TEXT
    )`);
    
    // Default Settings
    db.run(`INSERT OR IGNORE INTO settings (id, company_name, logo_url, invoice_primary_color, header_text, footer_text, contact_info)
      VALUES (1, 'شرکت ساختمانی نمونه', '', '#1e40af', 'برگه تحویل', 'توضیحات پیش فرض', 'آدرس نمونه')`);
  });
}

// --- API Routes ---

// Generic Helper
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// GET Metadata (All combined for efficiency, mimicking previous logic)
app.get('/api/metadata', async (req, res) => {
  try {
    const materials = await query("SELECT * FROM materials ORDER BY created_at DESC");
    const drivers = await query("SELECT * FROM drivers ORDER BY created_at DESC");
    const suppliers = await query("SELECT * FROM suppliers ORDER BY created_at DESC");
    const projects = await query("SELECT * FROM projects ORDER BY created_at DESC");
    const users = await query("SELECT * FROM users ORDER BY created_at DESC");
    const announcements = await query("SELECT * FROM announcements ORDER BY created_at DESC");
    const settings = await query("SELECT * FROM settings WHERE id = 1");

    res.json({
      materials,
      drivers,
      suppliers,
      projects,
      users,
      announcements: announcements.map(a => ({...a, target_roles: JSON.parse(a.target_roles || '[]')})),
      settings: settings[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Entries
app.get('/api/entries', async (req, res) => {
  try {
    const rows = await query("SELECT * FROM entries ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Entry
app.post('/api/entries', async (req, res) => {
  const { materialId, driverId, plateNumber, supplierId, projectId, tonnage, quantity, unit, entryDate } = req.body;
  const id = uuidv4();
  try {
    await run(
      `INSERT INTO entries (id, material_id, driver_id, plate_number, supplier_id, project_id, tonnage, quantity, unit, entry_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, materialId, driverId, plateNumber, supplierId, projectId, tonnage, quantity, unit, entryDate]
    );
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Entry
app.delete('/api/entries/:id', async (req, res) => {
  try {
    await run("DELETE FROM entries WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Helpers (Metadata)
app.post('/api/materials', async (req, res) => {
  const id = uuidv4();
  try {
    await run("INSERT INTO materials (id, name) VALUES (?, ?)", [id, req.body.name]);
    res.json({ id, name: req.body.name });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/drivers', async (req, res) => {
  const id = uuidv4();
  try {
    await run("INSERT INTO drivers (id, name, default_plate) VALUES (?, ?, ?)", [id, req.body.name, req.body.defaultPlate]);
    res.json({ id, name: req.body.name, defaultPlate: req.body.defaultPlate });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/suppliers', async (req, res) => {
  const id = uuidv4();
  try {
    await run("INSERT INTO suppliers (id, name) VALUES (?, ?)", [id, req.body.name]);
    res.json({ id, name: req.body.name });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/projects', async (req, res) => {
  const id = uuidv4();
  try {
    await run("INSERT INTO projects (id, name) VALUES (?, ?)", [id, req.body.name]);
    res.json({ id, name: req.body.name });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Users
app.post('/api/users', async (req, res) => {
  const id = uuidv4();
  try {
    await run("INSERT INTO users (id, name, username, role) VALUES (?, ?, ?, ?)", [id, req.body.name, req.body.username, req.body.role]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await run("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Announcements
app.post('/api/announcements', async (req, res) => {
  const id = uuidv4();
  try {
    await run("INSERT INTO announcements (id, title, content, date, target_roles) VALUES (?, ?, ?, ?, ?)", 
      [id, req.body.title, req.body.content, req.body.date, JSON.stringify(req.body.targetRoles)]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Settings
app.post('/api/settings', async (req, res) => {
  try {
    await run(`UPDATE settings SET company_name=?, logo_url=?, invoice_primary_color=?, header_text=?, footer_text=?, contact_info=? WHERE id=1`,
      [req.body.companyName, req.body.logoUrl, req.body.invoicePrimaryColor, req.body.headerText, req.body.footerText, req.body.contactInfo]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
