export const isPartner = (req, res, next) => {
  if (req.user.role !== 'PARTNER') {
    return res.status(403).json({
      message: 'Anda tidak memiliki akses untuk fitur ini, hanya untuk partner',
    });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      message: 'Anda tidak memiliki akses untuk fitur ini, hanya untuk admin',
    });
  }
  next();
};

export const isAdminOrPartner = (req, res, next) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'PARTNER') {
    return res.status(403).json({
      message:
        'Anda tidak memiliki akses untuk fitur ini, hanya untuk admin atau partner',
    });
  }
  next();
};
