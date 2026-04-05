import express from 'express';
import {
  createTicket,
  getTickets,
  getAllTickets,
  getTicketById,
  updateTicket,
} from '../controllers/ticketController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createTicket).get(protect, getTickets);
router.route('/all').get(protect, admin, getAllTickets);
router.route('/:id').get(protect, getTicketById).put(protect, updateTicket);

export default router;
