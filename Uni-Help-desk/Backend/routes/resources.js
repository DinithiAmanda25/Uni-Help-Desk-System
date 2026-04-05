const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  recordDownload,
} = require("../controllers/resourceController");

// Multer disk storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/resources"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });

// GET  /api/resources
router.get("/", getAllResources);

// GET  /api/resources/:id
router.get("/:id", getResourceById);

// POST /api/resources  (lecturer | admin, with file upload)
router.post("/", auth, authorize("lecturer", "admin"), upload.single("file"), createResource);

// PUT  /api/resources/:id
router.put("/:id", auth, authorize("lecturer", "admin"), updateResource);

// DELETE /api/resources/:id
router.delete("/:id", auth, authorize("lecturer", "admin"), deleteResource);

// POST /api/resources/:id/download
router.post("/:id/download", recordDownload);

module.exports = router;
