require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// ── Ensure upload folders exist ──────────────────────────────────────────────
["uploads/resources"].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",          require("./routes/auth"));
app.use("/api/resources",     require("./routes/resources"));
app.use("/api/books",         require("./routes/library"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/admin",         require("./routes/admin"));

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date(), db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" })
);

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// ── Connect to MongoDB Atlas and start server ────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌  MONGO_URI is not set. Check your .env file.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅  MongoDB Atlas connected successfully");
    const server = app.listen(PORT, () =>
      console.log(`🚀  Server running on http://localhost:${PORT}`)
    );

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌  Port ${PORT} is already in use.`);
        console.error(`   Run: Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force`);
      } else {
        console.error("❌  Server error:", err.message);
      }
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error("❌  MongoDB connection error:", err.message);
    process.exit(1);
  });
