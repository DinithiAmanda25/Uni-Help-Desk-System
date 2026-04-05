const Notification = require("../models/Notification");

/**
 * GET /api/notifications  (authenticated)
 */
exports.getAll = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    console.error("getAll notifications error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/notifications/:id/read  (authenticated)
 */
exports.markRead = async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { readStatus: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: "Notification not found." });
    res.json(notif);
  } catch (err) {
    console.error("markRead error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/notifications/read-all  (authenticated)
 */
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id }, { readStatus: true });
    res.json({ message: "All notifications marked as read." });
  } catch (err) {
    console.error("markAllRead error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/notifications/:id  (authenticated)
 */
exports.deleteNotification = async (req, res) => {
  try {
    const notif = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!notif) return res.status(404).json({ message: "Notification not found." });
    res.json({ message: "Notification deleted." });
  } catch (err) {
    console.error("deleteNotification error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
