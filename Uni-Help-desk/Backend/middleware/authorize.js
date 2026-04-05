/**
 * Role-based authorization middleware.
 * Must be used AFTER the `auth` middleware (so req.user is set).
 *
 * Usage:
 *   router.get("/admin-only", auth, authorize("admin"), handler);
 *   router.post("/upload",     auth, authorize("lecturer", "admin"), handler);
 */
module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires one of: [${allowedRoles.join(", ")}]. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};
