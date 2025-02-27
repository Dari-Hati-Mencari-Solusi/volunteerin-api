import * as partnerProfileModel from '../models/PartnerProfile.js';
import prisma from '../configs/dbConfig.js';
import { HttpError } from '../utils/error.js';

export const getAllPartnerProfiles = async (req, res, next) => {
  try {
    const result = await partnerProfileModel.getAllPartnerProfiles(req.query);

    if (!result.partnerProfiles.length) {
      throw new HttpError('Tidak ada profile partner yang ditemukan', 404);
    }

    res.status(200).json({
      message: 'Daftar profile partner berhasil diambil',
      data: result.partnerProfiles,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getPartnerProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw new HttpError('ID profile partner tidak valid', 400);
    }

    const partnerProfile = await partnerProfileModel.getPartnerProfileById(id);

    if (!partnerProfile) {
      throw new HttpError('Profile partner tidak ditemukan', 404);
    }

    res.status(200).json({
      message: 'Profile partner berhasil diambil',
      data: partnerProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPartnerProfile = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const partnerProfile =
      await partnerProfileModel.getPartnerProfileByUserId(userId);

    if (!partnerProfile) {
      throw new HttpError('Profile partner tidak ditemukan', 404);
    }

    res.status(200).json({
      message: 'Profile partner berhasil diambil',
      data: partnerProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const createPartnerProfile = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { validatedPartnerData } = req;

    const existingProfile = await prisma.partnerProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new HttpError(
        'Anda sudah memiliki profile partner. Silakan gunakan fitur update untuk memperbarui profile.',
        400,
      );
    }

    const partnerProfileData = {
      ...validatedPartnerData,
      userId,
      createdAt: new Date(),
    };

    const partnerProfile =
      await partnerProfileModel.createPartnerProfile(partnerProfileData);

    res.status(201).json({
      message: 'Profile partner berhasil dibuat',
      data: partnerProfile,
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error creating partner profile:', error);
    }
    next(error);
  }
};

export const updatePartnerProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { validatedPartnerData } = req;
    const isAdmin = req.user.role === 'ADMIN';

    if (!id || isNaN(id)) {
      throw new HttpError('ID profile partner tidak valid', 400);
    }

    const existingProfile = await partnerProfileModel.getPartnerProfileById(id);

    if (!existingProfile) {
      throw new HttpError('Profile partner tidak ditemukan', 404);
    }

    if (existingProfile.userId !== userId && !isAdmin) {
      throw new HttpError(
        'Anda tidak memiliki akses untuk mengubah profile partner ini',
        403,
      );
    }

    let partnerProfileData = { ...validatedPartnerData };
    if (!isAdmin) {
      delete partnerProfileData.eventQuota;
      delete partnerProfileData.status;
    }

    const partnerProfile = await partnerProfileModel.updatePartnerProfile(
      parseInt(id),
      partnerProfileData,
    );

    res.status(200).json({
      message: 'Profile partner berhasil diperbarui',
      data: partnerProfile,
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error updating partner profile:', error);
    }
    next(error);
  }
};

export const deletePartnerProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    if (!id || isNaN(id)) {
      throw new HttpError('ID profile partner tidak valid', 400);
    }

    const existingProfile = await partnerProfileModel.getPartnerProfileById(id);

    if (!existingProfile) {
      throw new HttpError('Profile partner tidak ditemukan', 404);
    }

    if (existingProfile.userId !== userId && req.user.role !== 'ADMIN') {
      throw new HttpError(
        'Anda tidak memiliki akses untuk menghapus profile partner ini',
        403,
      );
    }

    await partnerProfileModel.deletePartnerProfile(parseInt(id));

    res.status(200).json({
      message: 'Profile partner berhasil dihapus',
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error deleting partner profile:', error);
    }
    next(error);
  }
};
