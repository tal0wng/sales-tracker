const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Schema and model
const DataSchema = new mongoose.Schema({
  date: Date,
  sales: Number,
  expenses: Number
});

const Data = mongoose.model("Data", DataSchema);

// Routes
app.get("/api/data", async (req, res) => {
  const data = await Data.find();
  res.json(data);
});

app.post("/api/data", async (req, res) => {
  const newData = new Data(req.body);
  const saved = await newData.save();
  res.json(saved);
});

app.put("/api/data/:id", async (req, res) => {
  const updated = await Data.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/api/data/:id", async (req, res) => {
  await Data.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.get("/", (req, res) => {
  res.send("Sales Tracker API is live");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
