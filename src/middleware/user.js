import * as userModel from '../models/User.js';
import { HttpError } from '../utils/error.js';

export const checkEmailandPhoneNumberExist = async (req, _res, next) => {
  const { email, phoneNumber } = req.body;

  const userEmail = await userModel.getUserByEmail(email);
  if (userEmail) {
    next(
      new HttpError(
        'Email ini sudah digunakan oleh pengguna lain. Silakan gunakan email yang berbeda',
        409,
      ),
    );
    return;
  }

  const userPhoneNumber = await userModel.getUserByPhoneNumber(phoneNumber);
  if (userPhoneNumber) {
    next(
      new HttpError(
        'Nomor handphone ini sudah digunakan oleh pengguna lain. Silakan gunakan nomor yang berbeda',
        409,
      ),
    );
    return;
  }

  next();
};

export const checkUserExist = async (req, _res, next) => {
  const { id, email } = req.body;

  try {
    let user = null;

    if (id) {
      user = await userModel.getUserById(id);
    } else if (email) {
      user = await userModel.getUserByEmail(email);
    }

    if (!user) {
      return next(new HttpError('Maaf, akun tidak ditemukan.', 404));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const checkUserVerified = async (req, _res, next) => {
  if (!req.user) {
    return next(
      new HttpError(
        'Terjadi kesalahan, pengguna tidak ditemukan dalam permintaan.',
        500,
      ),
    );
  }

  if (!req.user.verifiedAt) {
    return next(
      new HttpError(
        'Maaf akun anda belum aktif, silahkan melakukan verifikasi akun terlebih dahulu',
        403,
      ),
    );
  }

  next();
};
