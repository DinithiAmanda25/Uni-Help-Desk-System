const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    reservedDate: { type: Date, default: Date.now },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    actualReturnDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "active", "returned", "cancelled", "overdue"],
      default: "pending",
    },
    fine: { type: Number, default: 0 },
    finePaid: { type: Boolean, default: false },
    duration: { type: Number, required: true }, // in days
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
