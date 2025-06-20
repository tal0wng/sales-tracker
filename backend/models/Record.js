const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  sales: Number,
  expenses: Number
});

module.exports = mongoose.model('Record', recordSchema);
