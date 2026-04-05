const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      default: "Low",
    },
    studentName: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Open",
    },
    assignedTo: {
      type: String,
      default: "",
    },
    attachments: {
      type: [String],
      default: [],
    },
    createdDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);