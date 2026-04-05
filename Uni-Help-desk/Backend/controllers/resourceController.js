const Resource = require("../models/Resource");
const path = require("path");

/**
 * GET /api/resources
 */
exports.getAllResources = async (req, res) => {
  try {
    const { search, category, type, sort, page = 1, limit = 12 } = req.query;
    const query = { accessLevel: "public", status: "published" };

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (type) query.fileType = type;

    const sortMap = {
      popular: { downloads: -1 },
      newest: { createdAt: -1 },
      rated: { rating: -1 },
    };
    const sortQuery = sortMap[sort] || { createdAt: -1 };

    const [resources, total] = await Promise.all([
      Resource.find(query)
        .sort(sortQuery)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("uploadedBy", "name"),
      Resource.countDocuments(query),
    ]);

    res.json({ resources, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("getAllResources error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/resources/:id
 */
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("uploadedBy", "name email");

    if (!resource) return res.status(404).json({ message: "Resource not found." });
    res.json(resource);
  } catch (err) {
    console.error("getResourceById error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/resources  (lecturer | admin, multipart)
 */
exports.createResource = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File is required." });

    const { title, description, category, tags, accessLevel, version } = req.body;
    if (!title || !category)
      return res.status(400).json({ message: "Title and category are required." });

    const resource = new Resource({
      title,
      description,
      fileUrl: req.file.path,
      fileType: path.extname(req.file.originalname).replace(".", "").toUpperCase(),
      fileSize: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
      category,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      accessLevel: accessLevel || "public",
      version: version || "1.0",
      uploadedBy: req.user.id,
    });
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    console.error("createResource error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/resources/:id  (lecturer can update own; admin can update any)
 */
exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found." });

    if (req.user.role === "lecturer" && resource.uploadedBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to edit this resource." });

    Object.assign(resource, req.body);
    await resource.save();
    res.json(resource);
  } catch (err) {
    console.error("updateResource error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/resources/:id
 */
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found." });

    if (req.user.role === "lecturer" && resource.uploadedBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to delete this resource." });

    await resource.deleteOne();
    res.json({ message: "Resource deleted successfully." });
  } catch (err) {
    console.error("deleteResource error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/resources/:id/download
 */
exports.recordDownload = async (req, res) => {
  try {
    await Resource.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });
    res.json({ message: "Download recorded." });
  } catch (err) {
    console.error("recordDownload error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
