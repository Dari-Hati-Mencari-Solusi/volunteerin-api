import * as benefitModel from '../models/Benefit.js';
import { HttpError } from '../utils/error.js';

export const ensureBenefitExists = async (req, _, next) => {
  try {
    const benefitId = req.params.id;
    const benefit = await benefitModel.getBenefitById(benefitId);

    if (!benefit) {
      throw new HttpError('Benefit tidak ditemukan', 404);
    }

    req.benefit = benefit;
    next();
  } catch (error) {
    next(error);
  }
};

export const ensureBenefitOwner = async (req, _, next) => {
  try {
    const { id: userId } = req.user;
    const benefitId = req.params.id;

    const benefit = await benefitModel.getBenefitById(benefitId);

    if (!benefit) {
      throw new HttpError('Benefit tidak ditemukan', 404);
    }

    // Admin dapat mengakses semua benefit
    if (req.user.role === 'ADMIN') {
      req.benefit = benefit;
      return next();
    }

    // Partner hanya boleh mengakses benefit yang dia buat
    if (benefit.userId !== userId) {
      throw new HttpError('Anda tidak memiliki akses untuk benefit ini', 403);
    }

    req.benefit = benefit;
    next();
  } catch (error) {
    next(error);
  }
};
