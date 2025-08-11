const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { HfInference } = require('@huggingface/inference');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const contentFile = path.join(__dirname, 'content.json');
let sessionToken = null;

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
