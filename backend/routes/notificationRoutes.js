const express = require("express");
const router = express.Router();

const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

router.get("/", getNotifications);
router.put("/:id", markAsRead);

module.exports = router;