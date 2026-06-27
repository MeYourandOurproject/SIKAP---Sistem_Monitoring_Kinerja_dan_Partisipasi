const express = require('express');
const router = express.Router();

const APPSCRIPT_URL = process.env.APPSCRIPT_URL || 'https://script.google.com/macros/s/AKfycby6SZbmrbgz2ebZY7jCmOKyphN5sOgUt6kx2VJozB_MhtWUOxUfcQ1uJVPHYRw5zfk/exec';

// Proxy GET requests to Apps Script
router.get('/attendance/list', async (req, res) => {
  try {
    const response = await fetch(`${APPSCRIPT_URL}?action=list`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Apps Script proxy error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Proxy POST requests to Apps Script
router.post('/attendance/add', async (req, res) => {
  try {
    const response = await fetch(APPSCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'add', record: req.body }),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Apps Script proxy error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
