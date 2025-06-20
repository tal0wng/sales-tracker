// 🔧 backend/routes/records.js
const express = require("express");
const router = express.Router();
const Record = require("../models/Record");

router.get("/", async (req, res) => {
  try {
    const records = await Record.find().sort({ date: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newRecord = new Record(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Record.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update record" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete record" });
  }
});

module.exports = router;
