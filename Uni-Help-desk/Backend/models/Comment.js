const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);