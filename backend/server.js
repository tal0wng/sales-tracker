// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const DataSchema = new mongoose.Schema({
  date: Date,
  sales: Number,
  expenses: Number,
});

const Data = mongoose.model("Data", DataSchema);

app.get("/api/data", async (req, res) => {
  const all = await Data.find();
  res.json(all);
});

app.post("/api/data", async (req, res) => {
  const entry = new Data(req.body);
  await entry.save();
  res.json(entry);
});

app.put("/api/data/:id", async (req, res) => {
  const updated = await Data.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/api/data/:id", async (req, res) => {
  await Data.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
