require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const port = Number(process.env.PORT || 5000);
const mongoUri = process.env.MONGODB_URI;

async function start() {
  if (!mongoUri) throw new Error("MONGODB_URI is required. Copy .env.example to .env.");
  await mongoose.connect(mongoUri);
  app.listen(port, () => console.log(`Health API listening on http://localhost:${port}`));
}

start().catch(error => {
  console.error("Unable to start health API:", error.message);
  process.exit(1);
});