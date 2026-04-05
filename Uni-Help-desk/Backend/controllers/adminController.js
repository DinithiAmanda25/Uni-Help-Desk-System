const User = require("../models/User");
const Resource = require("../models/Resource");
const Book = require("../models/Book");
const Reservation = require("../models/Reservation");

/**
 * GET /api/admin/stats
 */
exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalResources,
      totalBooks,
      totalReservations,
      overdueBooks,
    ] = await Promise.all([
      User.countDocuments(),
      Resource.countDocuments({ status: "published" }),
      Book.countDocuments(),
      Reservation.countDocuments({ status: "active" }),
      Reservation.countDocuments({ status: "overdue" }),
    ]);

    const totalDownloadsAgg = await Resource.aggregate([
      { $group: { _id: null, total: { $sum: "$downloads" } } },
    ]);

    res.json({
      totalUsers,
      totalResources,
      totalBooks,
      totalReservations,
      overdueBooks,
      totalDownloads: totalDownloadsAgg[0]?.total || 0,
    });
  } catch (err) {
    console.error("getStats error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/admin/users
 */
exports.getUsers = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    if (search)
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);
    res.json({ users, total });
  } catch (err) {
    console.error("getUsers error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/admin/users/:id/role
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["student", "lecturer", "admin"].includes(role))
      return res.status(400).json({ message: "Invalid role." });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    console.error("updateUserRole error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/admin/users/:id/status
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "inactive", "suspended"].includes(status))
      return res.status(400).json({ message: "Invalid status." });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    console.error("updateUserStatus error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/admin/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("deleteUser error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/admin/overdue
 */
exports.getOverdue = async (req, res) => {
  try {
    const now = new Date();

    // Update overdue status first
    await Reservation.updateMany(
      { status: "active", returnDate: { $lt: now } },
      { status: "overdue" }
    );

    const overdue = await Reservation.find({ status: "overdue" })
      .populate("userId", "name email studentId")
      .populate("bookId", "title author isbn");

    res.json(overdue);
  } catch (err) {
    console.error("getOverdue error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/admin/reservations  – all reservations with pagination
 */
exports.getAllReservations = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const [reservations, total] = await Promise.all([
      Reservation.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("userId", "name email studentId")
        .populate("bookId", "title author isbn"),
      Reservation.countDocuments(query),
    ]);
    res.json({ reservations, total });
  } catch (err) {
    console.error("getAllReservations error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
