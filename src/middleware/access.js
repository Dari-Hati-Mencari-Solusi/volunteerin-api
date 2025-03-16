// middleware/access.js
import { HttpError } from '../utils/error.js';
import prisma from '../configs/dbConfig.js';

/**
 * Middleware untuk memeriksa apakah pengguna memiliki peran Partner
 */
export const isPartner = (req, res, next) => {
  try {
    if (req.user.role !== 'PARTNER') {
      throw new HttpError(
        'Anda tidak memiliki akses untuk fitur ini, hanya untuk partner',
        403,
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware untuk memeriksa apakah pengguna memiliki peran Admin
 */
export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      throw new HttpError(
        'Anda tidak memiliki akses untuk fitur ini, hanya untuk admin',
        403,
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware untuk memeriksa apakah pengguna memiliki peran Admin atau Partner
 */
export const isAdminOrPartner = (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'PARTNER') {
      throw new HttpError(
        'Anda tidak memiliki akses untuk fitur ini, hanya untuk admin atau partner',
        403,
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware untuk memeriksa status partner
 * @param {Array} allowedStatuses - Array berisi status yang diperbolehkan
 */
export const checkPartnerStatus = (
  allowedStatuses = ['ACCEPTED', 'VERIFIED'],
) => {
  return async (req, res, next) => {
    try {
      const { id: userId } = req.user;

      const partnerProfile = await prisma.partnerProfile.findUnique({
        where: { userId },
        select: { status: true },
      });

      if (!partnerProfile) {
        throw new HttpError('Profile partner tidak ditemukan', 404);
      }

      if (!allowedStatuses.includes(partnerProfile.status)) {
        throw new HttpError(
          `Hanya partner dengan status ${allowedStatuses.join(' atau ')} yang dapat mengakses fitur ini`,
          403,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware untuk memeriksa apakah user adalah pemilik resource atau admin
 * @param {String} paramName - Nama parameter yang berisi id pemilik resource
 * @param {String} idField - Nama field id di dalam model (default: 'userId')
 */
export const isOwnerOrAdmin = (paramName, idField = 'userId') => {
  return async (req, res, next) => {
    try {
      const resourceOwnerId = req.params[paramName];
      const { id: userId, role } = req.user;

      // Admin punya akses penuh
      if (role === 'ADMIN') {
        return next();
      }

      // Jika bukan admin, harus pemilik resource
      if (resourceOwnerId !== userId) {
        throw new HttpError(
          'Anda tidak memiliki akses untuk resource ini',
          403,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware untuk memeriksa kuota event partner
 */
export const checkEventQuota = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const partnerProfile = await prisma.partnerProfile.findUnique({
      where: { userId },
      select: { eventQuota: true },
    });

    if (!partnerProfile) {
      throw new HttpError('Profile partner tidak ditemukan', 404);
    }

    const existingEventCount = await prisma.event.count({
      where: { userId },
    });

    if (existingEventCount >= partnerProfile.eventQuota) {
      throw new HttpError(
        'Anda telah mencapai batas maksimum pembuatan event. Silakan upgrade ke premium untuk menambah quota event.',
        403,
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
