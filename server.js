const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { HfInference } = require('@huggingface/inference');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const contentFile = path.join(__dirname, 'content.json');
let sessionToken = null;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

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
