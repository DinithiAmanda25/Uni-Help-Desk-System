const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["due", "new_resource", "fine", "reservation", "system", "download"],
      default: "system",
    },
    readStatus: { type: Boolean, default: false },
    relatedId: { type: mongoose.Schema.Types.ObjectId }, // resourceId or bookId
    relatedModel: { type: String, enum: ["Resource", "Book", "Reservation"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
