// 📁 backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const DataSchema = new mongoose.Schema({
  date: Date,
  sales: Number,
  expenses: Number
});

const Data = mongoose.model("Data", DataSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Routes
app.get("/api/data", async (req, res) => {
  const data = await Data.find();
  res.json(data);
});

app.post("/api/data", async (req, res) => {
  const newData = new Data(req.body);
  await newData.save();
  res.json(newData);
});

app.delete("/api/data/:id", async (req, res) => {
  await Data.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

app.put("/api/data/:id", async (req, res) => {
  const updated = await Data.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
