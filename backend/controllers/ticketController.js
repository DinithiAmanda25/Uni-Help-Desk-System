import Ticket from '../models/Ticket.js';

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = async (req, res) => {
  const { title, description, category, priority } = req.body;

  if (!title || !description || !category) {
    res.status(400).json({ message: 'Please provide all required fields' });
    return;
  }

  const ticket = await Ticket.create({
    user: req.user._id,
    title,
    description,
    category,
    priority,
  });

  res.status(201).json(ticket);
};

// @desc    Get user tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res) => {
  const tickets = await Ticket.find({ user: req.user._id });
  res.json(tickets);
};

// @desc    Get all tickets (Admin/Staff)
// @route   GET /api/tickets/all
// @access  Private/Admin/Staff
const getAllTickets = async (req, res) => {
  const tickets = await Ticket.find({}).populate('user', 'name email');
  res.json(tickets);
};

// @desc    Get ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id).populate('user', 'name email');

  if (ticket) {
    if (ticket.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    res.json(ticket);
  } else {
    res.status(404).json({ message: 'Ticket not found' });
  }
};

// @desc    Update ticket status/priority
// @route   PUT /api/tickets/:id
// @access  Private/Admin/Staff
const updateTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (ticket) {
    ticket.status = req.body.status || ticket.status;
    ticket.priority = req.body.priority || ticket.priority;
    ticket.assignedTo = req.body.assignedTo || ticket.assignedTo;

    const updatedTicket = await ticket.save();
    res.json(updatedTicket);
  } else {
    res.status(404).json({ message: 'Ticket not found' });
  }
};

export {
  createTicket,
  getTickets,
  getAllTickets,
  getTicketById,
  updateTicket,
};
