import express from 'express';
import {
  getNotifications,
  markRead,
  markAllRead,
  createNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getNotifications).post(protect, createNotification);
router.route('/read-all').put(protect, markAllRead);
router.route('/:id').put(protect, markRead);

export default router;
