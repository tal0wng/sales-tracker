// 🔧 backend/models/Record.js
const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  sales: {
    type: Number,
    required: true
  },
  expenses: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Record", recordSchema);
