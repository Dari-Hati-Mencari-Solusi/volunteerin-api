import * as partnerProfileModel from '../models/PartnerProfile.js';
import { HttpError } from '../utils/error.js';
import prisma from '../configs/dbConfig.js';

/**
 * Middleware untuk memastikan akun partner sudah direview
 */
export const isPartnerReviewed = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const partnerProfile =
      await partnerProfileModel.getPartnerProfileByUserId(userId);

    if (!partnerProfile) {
      throw new HttpError('Profile partner tidak ditemukan', 404);
    }

    // Cek apakah status minimal REVIEWED
    if (partnerProfile.status === 'REVIEWED') {
      req.partnerProfile = partnerProfile;
      return next();
    }

    return res.status(403).json({
      message: 'Profil partner Anda belum direview oleh admin',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware untuk memastikan profile partner sudah diterima
 */
export const isProfileAccepted = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const partnerProfile =
      await partnerProfileModel.getPartnerProfileByUserId(userId);

    if (!partnerProfile) {
      throw new HttpError('Profile partner tidak ditemukan', 404);
    }

    // Cek apakah status profile sudah diterima
    const acceptedStatuses = ['ACCEPTED_PROFILE', 'ACCEPTED_LEGALITY'];
    if (acceptedStatuses.includes(partnerProfile.status)) {
      req.partnerProfile = partnerProfile;
      return next();
    }

    return res.status(403).json({
      message: 'Profil partner Anda belum disetujui oleh admin',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware untuk memastikan legalitas partner sudah diterima
 */
export const isLegalityAccepted = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const partnerProfile = await partnerProfileModel.getPartnerProfileByUserId(
      userId,
      { legality: true },
    );

    if (!partnerProfile) {
      throw new HttpError('Profile partner tidak ditemukan', 404);
    }

    // Cek apakah legalitas sudah diupload
    if (!partnerProfile.legality) {
      return res.status(403).json({
        message: 'Anda belum mengupload dokumen legalitas',
      });
    }

    // Cek apakah status legalitas sudah diterima
    if (partnerProfile.status === 'ACCEPTED_LEGALITY') {
      req.partnerProfile = partnerProfile;
      return next();
    }

    return res.status(403).json({
      message: 'Legalitas partner Anda belum disetujui oleh admin',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware untuk memastikan partner tidak ditolak
 */
export const isNotRejected = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const partnerProfile =
      await partnerProfileModel.getPartnerProfileByUserId(userId);

    if (!partnerProfile) {
      throw new HttpError('Profile partner tidak ditemukan', 404);
    }

    // Cek apakah status ditolak
    const rejectedStatuses = ['REJECTED_PROFILE', 'REJECTED_LEGALITY'];
    if (rejectedStatuses.includes(partnerProfile.status)) {
      return res.status(403).json({
        message: `Profil atau legalitas partner Anda ditolak. Silakan perbaiki ${
          partnerProfile.status === 'REJECTED_PROFILE' ? 'profil' : 'legalitas'
        } Anda.`,
        information:
          partnerProfile.information || 'Tidak ada informasi tambahan',
      });
    }

    req.partnerProfile = partnerProfile;
    return next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware untuk memastikan partner masih memiliki kuota event
 */
export const hasEventQuota = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const partnerProfile =
      await partnerProfileModel.getPartnerProfileByUserId(userId);

    if (!partnerProfile) {
      throw new HttpError('Profile partner tidak ditemukan', 404);
    }

    // Cek berapa event yang sudah dibuat
    const eventsCount = await prisma.event.count({
      where: {
        userId,
        status: {
          notIn: ['REJECTED', 'DELETED'],
        },
      },
    });

    if (partnerProfile.eventQuota && eventsCount >= partnerProfile.eventQuota) {
      return res.status(403).json({
        message: 'Anda telah mencapai batas kuota pembuatan event',
        currentCount: eventsCount,
        quota: partnerProfile.eventQuota,
      });
    }

    // Simpan partner profile dan event count ke request untuk digunakan oleh controller
    req.partnerProfile = partnerProfile;
    req.eventsCount = eventsCount;
    return next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware gabungan untuk memastikan partner memenuhi semua syarat untuk membuat event
 */
export const canCreateEvent = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const partnerProfile = await partnerProfileModel.getPartnerProfileByUserId(
      userId,
      { legality: true },
    );

    if (!partnerProfile) {
      throw new HttpError('Profile partner tidak ditemukan', 404);
    }

    // Cek apakah status ditolak
    const rejectedStatuses = ['REJECTED_PROFILE', 'REJECTED_LEGALITY'];
    if (rejectedStatuses.includes(partnerProfile.status)) {
      return res.status(403).json({
        message: `Anda tidak dapat membuat event karena ${
          partnerProfile.status === 'REJECTED_PROFILE' ? 'profil' : 'legalitas'
        } Anda ditolak. Silakan perbaiki terlebih dahulu.`,
        information:
          partnerProfile.information || 'Tidak ada informasi tambahan',
      });
    }

    // Cek apakah legalitas sudah diupload
    if (!partnerProfile.legality) {
      return res.status(403).json({
        message: 'Anda belum mengupload dokumen legalitas',
      });
    }

    // Cek apakah legalitas sudah diterima
    if (partnerProfile.status !== 'ACCEPTED_LEGALITY') {
      return res.status(403).json({
        message: 'Legalitas partner Anda belum disetujui oleh admin',
      });
    }

    // Cek berapa event yang sudah dibuat
    const eventsCount = await prisma.event.count({
      where: {
        userId,
        status: {
          notIn: ['REJECTED', 'DELETED'],
        },
      },
    });

    // Bandingkan dengan event quota
    if (partnerProfile.eventQuota && eventsCount >= partnerProfile.eventQuota) {
      return res.status(403).json({
        message: 'Anda telah mencapai batas kuota pembuatan event',
        currentCount: eventsCount,
        quota: partnerProfile.eventQuota,
      });
    }

    // Simpan partner profile dan event count ke request untuk digunakan oleh controller
    req.partnerProfile = partnerProfile;
    req.eventsCount = eventsCount;
    return next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware untuk memastikan partner profile sudah lengkap
 */
export const isProfileComplete = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    // Dapatkan profile partner
    const partnerProfile = await partnerProfileModel.getPartnerProfileByUserId(
      userId,
      {
        responsiblePersons: true,
        legality: true,
      },
    );

    if (!partnerProfile) {
      return res.status(403).json({
        message: 'Anda belum membuat profil partner',
      });
    }

    // Cek apakah ada responsible person
    if (!partnerProfile.responsiblePersons) {
      return res.status(403).json({
        message: 'Anda belum mengisi data penanggung jawab',
      });
    }

    req.partnerProfile = partnerProfile;
    return next();
  } catch (error) {
    next(error);
  }
};
