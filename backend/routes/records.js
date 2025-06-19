const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// Create a record
router.post('/', async (req, res) => {
  try {
    const record = new Record(req.body);
    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get records by date range
router.get('/', async (req, res) => {
  const { start, end } = req.query;
  try {
    const records = await Record.find({
      date: { $gte: new Date(start), $lte: new Date(end) }
    }).sort({ date: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
