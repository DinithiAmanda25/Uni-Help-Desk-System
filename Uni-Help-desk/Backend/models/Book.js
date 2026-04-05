const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true },
    isbn: { type: String, unique: true, sparse: true },
    category: { type: String, required: true },
    totalCopies: { type: Number, required: true, min: 1 },
    availableCopies: { type: Number, required: true, min: 0 },
    location: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
