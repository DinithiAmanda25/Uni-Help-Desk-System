const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");
const Notification = require("../models/Notification");

const addComment = async (req, res) => {
  try {
    const { ticketId, userId, message, attachments } = req.body;

    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Valid ticketId is required" });
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (!userId || !message) {
      return res.status(400).json({ message: "userId and message are required" });
    }

    const comment = await Comment.create({
      ticketId,
      userId,
      message,
      attachments: attachments || [],
    });

    if (userId === "admin") {
      await Notification.create({
        ticketId,
        userEmail: ticket.studentEmail,
        message: `Admin replied to your ticket: ${ticket.title}`,
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getCommentsByTicket = async (req, res) => {
  try {
    const ticketId = String(req.params.ticketId).trim();

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const comments = await Comment.find({ ticketId }).sort({ createdAt: 1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getCommentsByTicket,
};