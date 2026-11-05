const express = require("express");
const mongoose = require("mongoose");
const Measurement = require("../models/Measurement");
const router = express.Router();

const numericFields = ["heartRate", "spo2", "temperatureC"];
function validatePayload(body) {
  const errors = [];
  for (const field of numericFields) {
    if (body[field] === undefined || body[field] === "" || !Number.isFinite(Number(body[field]))) errors.push(`${field} must be a number`);
  }
  if (body.heartRate != null && (Number(body.heartRate) < 30 || Number(body.heartRate) > 220)) errors.push("heartRate must be between 30 and 220");
  if (body.spo2 != null && (Number(body.spo2) < 50 || Number(body.spo2) > 100)) errors.push("spo2 must be between 50 and 100");
  if (body.temperatureC != null && (Number(body.temperatureC) < 25 || Number(body.temperatureC) > 45)) errors.push("temperatureC must be between 25 and 45");
  if (body.note && String(body.note).length > 300) errors.push("note must be at most 300 characters");
  return errors;
}

router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    const records = await Measurement.find().sort({ recordedAt: -1 }).limit(limit).lean();
    res.json(records);
  } catch (error) { next(error); }
});

router.post("/", async (req, res, next) => {
  try {
    const errors = validatePayload(req.body);
    if (errors.length) return res.status(400).json({ error: "Validation failed", details: errors });
    const record = await Measurement.create({
      heartRate: Number(req.body.heartRate), spo2: Number(req.body.spo2),
      temperatureC: Number(req.body.temperatureC),
      source: req.body.source === "device" ? "device" : "manual",
      note: String(req.body.note || "").trim()
    });
    res.status(201).json(record);
  } catch (error) { next(error); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid record identifier" });
    const deleted = await Measurement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Measurement not found" });
    res.status(204).end();
  } catch (error) { next(error); }
});

module.exports = router;