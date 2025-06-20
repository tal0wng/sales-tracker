// 🔧 backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Define Mongoose Schema
const recordSchema = new mongoose.Schema({
  date: String,
  sales: Number,
  expenses: Number
});

const Record = mongoose.model("Record", recordSchema);

// Routes
app.get("/api/data", async (req, res) => {
  const data = await Record.find().sort({ date: 1 });
  res.json(data);
});

app.post("/api/data", async (req, res) => {
  const { date, sales, expenses } = req.body;
  const newRecord = new Record({ date, sales, expenses });
  await newRecord.save();
  res.json({ message: "Record added" });
});

app.delete("/api/data/:id", async (req, res) => {
  await Record.findByIdAndDelete(req.params.id);
  res.json({ message: "Record deleted" });
});

app.put("/api/data/:id", async (req, res) => {
  const { date, sales, expenses } = req.body;
  await Record.findByIdAndUpdate(req.params.id, { date, sales, expenses });
  res.json({ message: "Record updated" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
