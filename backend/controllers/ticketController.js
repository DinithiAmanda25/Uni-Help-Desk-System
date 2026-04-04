const mongoose = require("mongoose");
const streamifier = require("streamifier");
const Ticket = require("../models/Ticket");
const Notification = require("../models/Notification");
const cloudinary = require("../config/cloudinary");

const createTicket = async (req, res) => {
  try {
    let attachmentUrl = "";

    if (req.file) {
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "ticket_attachments", resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const uploadedFile = await uploadFromBuffer();
      attachmentUrl = uploadedFile.secure_url;
    }

    const count = await Ticket.countDocuments();
    const ticketId = "T" + String(count + 1).padStart(7, "0");

    const ticket = await Ticket.create({
      ...req.body,
      ticketId,
      attachments: attachmentUrl ? [attachmentUrl] : [],
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdDate: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicketsByStudent = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      studentEmail: req.params.email,
    }).sort({ createdDate: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignTicket = async (req, res) => {
  try {
    const ticketMongoId = String(req.params.id).trim();

    if (!mongoose.Types.ObjectId.isValid(ticketMongoId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findById(ticketMongoId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (!req.body || !req.body.assignedTo) {
      return res.status(400).json({ message: "assignedTo is required" });
    }

    ticket.assignedTo = req.body.assignedTo;
    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Assign ticket error:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const ticketMongoId = String(req.params.id).trim();

    if (!mongoose.Types.ObjectId.isValid(ticketMongoId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findById(ticketMongoId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (!req.body || !req.body.status) {
      return res.status(400).json({ message: "status is required" });
    }

    ticket.status = req.body.status;
    await ticket.save();

    await Notification.create({
      ticketId: ticket._id,
      userEmail: ticket.studentEmail,
      message: `Your ticket "${ticket.title}" status changed to ${ticket.status}`,
    });

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Update ticket status error:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticketMongoId = String(req.params.id).trim();

    if (!mongoose.Types.ObjectId.isValid(ticketMongoId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findById(ticketMongoId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await Ticket.findByIdAndDelete(ticketMongoId);

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Delete ticket error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketsByStudent,
  assignTicket,
  updateTicketStatus,
  deleteTicket,
};