const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const Record = require("./model");

app.get("/api/data", async (req, res) => {
  const data = await Record.find().sort({ date: 1 });
  res.json(data);
});

app.post("/api/data", async (req, res) => {
  const newRecord = new Record(req.body);
  await newRecord.save();
  res.status(201).json(newRecord);
});

app.put("/api/data/:id", async (req, res) => {
  const updated = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/api/data/:id", async (req, res) => {
  await Record.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
