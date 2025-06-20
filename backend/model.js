const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  date: String,
  sales: Number,
  expenses: Number
});

module.exports = mongoose.model("Record", recordSchema);
