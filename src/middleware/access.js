/**
 * Middleware to authorize access based on user roles.
 * Use Roles constant from src/constants/roles.js to avoid typo.
 *
 * @example authorize(['VOLUNTEER', 'ADMIN'])
 * @param {array<string>} roles Accept VOLUNTEER, ADMIN, PARTNER (uppercase only)
 * @returns middleware
 */
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Anda tidak memiliki akses ke fitur ini',
      });
    }

    next();
  };
};
