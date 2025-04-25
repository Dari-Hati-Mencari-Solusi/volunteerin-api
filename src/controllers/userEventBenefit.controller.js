import * as userEventBenefitModel from '../models/UserEventBenefit.js';
import { HttpError } from '../utils/error.js';
import prisma from '../configs/dbConfig.js';

export const getAllUserEventBenefits = async (req, res, next) => {
  try {
    const result = await userEventBenefitModel.getAllUserEventBenefits(
      req.query,
    );

    if (!result.userEventBenefits.length) {
      throw new HttpError('Tidak ada user event benefit yang ditemukan', 404);
    }

    res.status(200).json({
      message: 'Daftar user event benefit berhasil diambil',
      data: result.userEventBenefits,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserEventBenefitById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new HttpError('ID user event benefit tidak valid', 400);
    }

    const userEventBenefit =
      await userEventBenefitModel.getUserEventBenefitById(id);

    if (!userEventBenefit) {
      throw new HttpError('User event benefit tidak ditemukan', 404);
    }

    res.status(200).json({
      message: 'User event benefit berhasil diambil',
      data: userEventBenefit,
    });
  } catch (error) {
    next(error);
  }
};

export const createUserEventBenefit = async (req, res, next) => {
  try {
    const { validatedUserEventBenefitData } = req;

    // Validasi event
    const existingEvent = await prisma.event.findUnique({
      where: { id: validatedUserEventBenefitData.eventId },
    });

    if (!existingEvent) {
      throw new HttpError('Event tidak ditemukan', 404);
    }

    // Validasi user jika ada
    if (validatedUserEventBenefitData.userId) {
      const existingUser = await prisma.user.findUnique({
        where: { id: validatedUserEventBenefitData.userId },
      });

      if (!existingUser) {
        throw new HttpError('User tidak ditemukan', 404);
      }
    }

    const userEventBenefit = await userEventBenefitModel.createUserEventBenefit(
      validatedUserEventBenefitData,
    );

    res.status(201).json({
      message: 'User event benefit berhasil dibuat',
      data: userEventBenefit,
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error creating user event benefit:', error);
    }
    next(error);
  }
};

export const updateUserEventBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { validatedUserEventBenefitData } = req;

    if (!id) {
      throw new HttpError('ID user event benefit tidak valid', 400);
    }

    // Cek apakah user event benefit ada
    const existingUserEventBenefit =
      await userEventBenefitModel.getUserEventBenefitById(id);

    if (!existingUserEventBenefit) {
      throw new HttpError('User event benefit tidak ditemukan', 404);
    }

    // Validasi event
    if (
      validatedUserEventBenefitData.eventId &&
      validatedUserEventBenefitData.eventId !== existingUserEventBenefit.eventId
    ) {
      const existingEvent = await prisma.event.findUnique({
        where: { id: validatedUserEventBenefitData.eventId },
      });

      if (!existingEvent) {
        throw new HttpError('Event tidak ditemukan', 404);
      }
    }

    // Validasi user jika ada
    if (validatedUserEventBenefitData.userId) {
      const existingUser = await prisma.user.findUnique({
        where: { id: validatedUserEventBenefitData.userId },
      });

      if (!existingUser) {
        throw new HttpError('User tidak ditemukan', 404);
      }
    }

    const userEventBenefit = await userEventBenefitModel.updateUserEventBenefit(
      id,
      validatedUserEventBenefitData,
    );

    res.status(200).json({
      message: 'User event benefit berhasil diperbarui',
      data: userEventBenefit,
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error updating user event benefit:', error);
    }
    next(error);
  }
};

export const deleteUserEventBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new HttpError('ID user event benefit tidak valid', 400);
    }

    // Cek apakah user event benefit ada
    const existingUserEventBenefit =
      await userEventBenefitModel.getUserEventBenefitById(id);

    if (!existingUserEventBenefit) {
      throw new HttpError('User event benefit tidak ditemukan', 404);
    }

    await userEventBenefitModel.deleteUserEventBenefit(id);

    res.status(200).json({
      message: 'User event benefit berhasil dihapus',
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error deleting user event benefit:', error);
    }
    next(error);
  }
};
