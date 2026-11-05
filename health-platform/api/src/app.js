const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const measurementRoutes = require("./routes/measurements");

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://127.0.0.1:5500" }));
app.use(express.json({ limit: "20kb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 150, standardHeaders: "draft-7", legacyHeaders: false }));

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "intelligent-health-api" }));
app.use("/api/measurements", measurementRoutes);
app.use((error, _req, res, _next) => {
  if (error.name === "ValidationError") return res.status(400).json({ error: "Invalid measurement", details: error.message });
  if (error.name === "CastError") return res.status(400).json({ error: "Invalid record identifier" });
  console.error(error);
  return res.status(500).json({ error: "Unexpected server error" });
});

module.exports = app;