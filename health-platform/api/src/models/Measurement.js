const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema({
  recordedAt: { type: Date, default: Date.now, required: true },
  heartRate: { type: Number, min: 30, max: 220, required: true },
  spo2: { type: Number, min: 50, max: 100, required: true },
  temperatureC: { type: Number, min: 25, max: 45, required: true },
  source: { type: String, enum: ["manual", "device"], default: "manual" },
  note: { type: String, maxlength: 300, default: "" }
}, { timestamps: true });

measurementSchema.index({ recordedAt: -1 });
module.exports = mongoose.model("Measurement", measurementSchema);