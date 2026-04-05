const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  getStats,
  getUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getOverdue,
  getAllReservations,
} = require("../controllers/adminController");

// All admin routes require authentication + admin role
router.use(auth, authorize("admin"));

// GET  /api/admin/stats
router.get("/stats", getStats);

// GET  /api/admin/users
router.get("/users", getUsers);

// PUT  /api/admin/users/:id/role
router.put("/users/:id/role", updateUserRole);

// PUT  /api/admin/users/:id/status
router.put("/users/:id/status", updateUserStatus);

// DELETE /api/admin/users/:id
router.delete("/users/:id", deleteUser);

// GET  /api/admin/overdue
router.get("/overdue", getOverdue);

// GET  /api/admin/reservations
router.get("/reservations", getAllReservations);

module.exports = router;
