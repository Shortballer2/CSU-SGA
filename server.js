const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { HfInference } = require('@huggingface/inference');
const multer = require('multer');
const cors = require('cors');
const XLSX = require('xlsx');

const app = express();
app.use(cors());
app.use(express.json());

const EMAIL_DOMAIN = '@student.csuniv.edu';
const contentFile = path.join(__dirname, 'content.json');
const dataDir = path.join(__dirname, 'data');
const voterRegistryFile = path.join(dataDir, 'voter-registry.json');
const votesFile = path.join(dataDir, 'votes.json');
let sessionToken = null;

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

function normalizeName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function normalizeEmail(email) {
  const raw = String(email || '').trim().toLowerCase();
  const localPart = raw.replace(EMAIL_DOMAIN, '').replace(/[^a-z0-9]/g, '');
  return localPart ? `${localPart}${EMAIL_DOMAIN}` : '';
}

function loadJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error);
    return fallback;
  }
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function readVoterRegistry() {
  return loadJson(voterRegistryFile, []);
}

function readVotes() {
  return loadJson(votesFile, []);
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
const spreadsheetUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.xlsx' || ext === '.xls' || ext === '.csv') {
      cb(null, true);
      return;
    }
    cb(new Error('Only Excel or CSV files are allowed for voter uploads.'));
  }
});

function authMiddleware(req, res, next) {
  if (req.headers.authorization !== `Bearer ${sessionToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Default admin credentials if environment variables are not set
const ADMIN_USER = process.env.ADMIN_USER || 'SGAexecutive';
const ADMIN_PASS = process.env.ADMIN_PASS || 'eVery0neshouldjoin5GA';

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    sessionToken = crypto.randomBytes(16).toString('hex');
    res.json({ token: sessionToken });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/content', (req, res) => {
  fs.readFile(contentFile, 'utf8', (err, data) => {
    if (err) {
      res.json({
        personnel: { executives: [], cabinet: [], senators: [] },
        events: [],
        media: []
      });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.put('/api/content', (req, res) => {
  if (req.headers.authorization !== `Bearer ${sessionToken}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  fs.writeFile(contentFile, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      res.status(500).json({ error: 'Failed to save content' });
    } else {
      res.json({ status: 'ok' });
    }
  });
});

app.post('/api/upload', authMiddleware, upload.single('media'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.post('/api/voters/upload', authMiddleware, spreadsheetUpload.single('voters'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No spreadsheet uploaded' });
  }

  try {
    const workbook = XLSX.readFile(req.file.path);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

    const registryMap = new Map();

    rows.forEach(row => {
      const values = Object.values(row).map(value => String(value || '').trim());
      let name = '';
      let email = '';

      Object.entries(row).forEach(([key, value]) => {
        const lower = key.toLowerCase();
        const text = String(value || '').trim();
        if (!name && lower.includes('name')) name = text;
        if (!email && lower.includes('mail')) email = text;
      });

      if (!name) name = values[0] || '';
      if (!email) email = values[1] || '';

      const normalizedName = normalizeName(name);
      const normalizedEmail = normalizeEmail(email);

      if (!normalizedName || !normalizedEmail) return;
      registryMap.set(normalizedEmail, {
        name: name.trim(),
        normalizedName,
        email: normalizedEmail
      });
    });

    const registry = Array.from(registryMap.values());
    saveJson(voterRegistryFile, registry);

    res.json({
      status: 'ok',
      registeredVoters: registry.length,
      emailFormat: `All emails normalized to *${EMAIL_DOMAIN}`
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to parse spreadsheet. Ensure it includes name and email columns.' });
  } finally {
    fs.unlink(req.file.path, () => {});
  }
});

app.get('/api/voters/stats', authMiddleware, (req, res) => {
  res.json({
    registeredVoters: readVoterRegistry().length,
    submittedVotes: readVotes().length
  });
});

app.post('/api/vote', (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = normalizeEmail(req.body.email);

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const registry = readVoterRegistry();
  const normalizedName = normalizeName(name);
  const voter = registry.find(entry => entry.email === email && entry.normalizedName === normalizedName);

  if (!voter) {
    return res.status(403).json({ error: 'Voter verification failed. Please check your name and student email format.' });
  }

  const votes = readVotes();
  if (votes.some(v => v.email === email)) {
    return res.status(409).json({ error: 'This voter has already submitted a vote.' });
  }

  votes.push({
    name: voter.name,
    email,
    submittedAt: new Date().toISOString(),
    ballot: req.body.ballot || null
  });
  saveJson(votesFile, votes);

  res.json({ status: 'ok', message: 'Vote recorded successfully.' });
});

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) {
    res
      .status(500)
      .json({ error: 'Server misconfiguration: missing HF_API_KEY' });
    return;
  }

  const { messages } = req.body;
  try {
    const hf = new HfInference(apiKey);
    const response = await hf.chatCompletion({
      model: 'microsoft/Phi-3-mini-4k-instruct',
      messages
    });

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch from Hugging Face' });
  }
});

// Serve static files after API routes to ensure the endpoints work properly
app.use(express.static(__dirname));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
