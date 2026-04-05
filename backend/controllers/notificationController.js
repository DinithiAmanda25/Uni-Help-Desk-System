import Notification from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
const markRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    if (notification.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    notification.read = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } else {
    res.status(404).json({ message: 'Notification not found' });
  }
};

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllRead = async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ message: 'All notifications marked as read' });
};

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private (Internal use mainly)
const createNotification = async (req, res) => {
  const { userId, message, type } = req.body;
  const notification = await Notification.create({
    user: userId,
    message,
    type,
  });
  res.status(201).json(notification);
};

export {
  getNotifications,
  markRead,
  markAllRead,
  createNotification,
};
