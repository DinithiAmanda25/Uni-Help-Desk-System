const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ["PDF", "EPUB", "PPT", "DOC", "Video", "Image"], required: true },
    fileSize: { type: String, default: "" },
    category: { type: String, required: true },
    tags: [{ type: String, lowercase: true }],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    accessLevel: { type: String, enum: ["public", "private", "role"], default: "public" },
    version: { type: String, default: "1.0" },
    status: { type: String, enum: ["published", "draft"], default: "published" },
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text search index
resourceSchema.index({ title: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Resource", resourceSchema);
