export const isAdminOrPartner = async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'PARTNER') {
      return res.status(403).json({ message: 'Akses Ditolak!' });
    }
    next();
  } catch (error) {
    next(error);
  }
};
