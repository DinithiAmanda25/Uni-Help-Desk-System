const ALLOWED_ROLES = ['admin', 'student'];

const getRoleFromRequest = (req) => {
	const headerRole = (req.headers['x-user-role'] || '').toString().trim().toLowerCase();
	const queryRole = (req.query.role || '').toString().trim().toLowerCase();
	const role = headerRole || queryRole || 'student';

	if (!ALLOWED_ROLES.includes(role)) {
		return null;
	}

	return role;
};

const attachRole = (req, res, next) => {
	const role = getRoleFromRequest(req);
	if (!role) {
		return res.status(401).json({ message: 'Invalid role. Use admin or student.' });
	}

	req.userRole = role;
	return next();
};

const allowRoles = (roles) => (req, res, next) => {
	if (!roles.includes(req.userRole)) {
		return res.status(403).json({ message: 'Forbidden: insufficient role permissions.' });
	}

	return next();
};

const adminOnly = allowRoles(['admin']);
const studentOrAdmin = allowRoles(['admin', 'student']);

module.exports = {
	attachRole,
	adminOnly,
	studentOrAdmin
};
