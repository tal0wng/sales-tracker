const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));

// Schema
const recordSchema = new mongoose.Schema({
  date: Date,
  sales: Number,
  expenses: Number
});
const Record = mongoose.model('Record', recordSchema);

// Routes

// GET records by date range
app.get('/api/records', async (req, res) => {
  const { start, end } = req.query;
  const records = await Record.find({
    date: { $gte: new Date(start), $lte: new Date(end) }
  }).sort({ date: 1 });
  res.json(records);
});

// POST new record
app.post('/api/records', async (req, res) => {
  const newRecord = new Record(req.body);
  await newRecord.save();
  res.json({ message: 'Record saved' });
});

// ✅ PUT update record
app.put('/api/records/:id', async (req, res) => {
  const { id } = req.params;
  await Record.findByIdAndUpdate(id, req.body);
  res.json({ message: 'Record updated' });
});

// ✅ DELETE record
app.delete('/api/records/:id', async (req, res) => {
  const { id } = req.params;
  await Record.findByIdAndDelete(id);
  res.json({ message: 'Record deleted' });
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
