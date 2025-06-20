// 🔧 backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv\config");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB connection error:", err));

const SalesEntrySchema = new mongoose.Schema({
  date: Date,
  sales: Number,
  expenses: Number,
  remarks: String,
  unpaidLaundry: Boolean
});

const SalesEntry = mongoose.model("SalesEntry", SalesEntrySchema);

app.get("/api/data", async (req, res) => {
  const entries = await SalesEntry.find();
  res.json(entries);
});

app.post("/api/data", async (req, res) => {
  const { date, sales, expenses, remarks, unpaidLaundry } = req.body;
  const newEntry = new SalesEntry({ date, sales, expenses, remarks, unpaidLaundry });
  await newEntry.save();
  res.json(newEntry);
});

app.put("/api/data/:id", async (req, res) => {
  const { id } = req.params;
  const { date, sales, expenses, remarks, unpaidLaundry } = req.body;
  const updated = await SalesEntry.findByIdAndUpdate(id, { date, sales, expenses, remarks, unpaidLaundry }, { new: true });
  res.json(updated);
});

app.delete("/api/data/:id", async (req, res) => {
  const { id } = req.params;
  await SalesEntry.findByIdAndDelete(id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
