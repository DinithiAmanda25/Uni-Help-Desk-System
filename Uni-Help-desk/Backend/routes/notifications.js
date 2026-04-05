const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAll,
  markRead,
  markAllRead,
  deleteNotification,
} = require("../controllers/notificationController");

// ⚠️  /read-all must come before /:id to avoid being matched as an ID
// GET  /api/notifications
router.get("/", auth, getAll);

// PUT  /api/notifications/read-all  (must be before /:id/read)
router.put("/read-all", auth, markAllRead);

// PUT  /api/notifications/:id/read
router.put("/:id/read", auth, markRead);

// DELETE /api/notifications/:id
router.delete("/:id", auth, deleteNotification);

module.exports = router;
