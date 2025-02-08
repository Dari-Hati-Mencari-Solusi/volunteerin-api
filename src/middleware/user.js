import { getUserByEmail, getUserByPhoneNumber } from '../models/User.js';
import { HttpError } from '../utils/error.js';

export const checkEmailandPhoneNumberExist = async (req, _res, next) => {
  const { email, phoneNumber } = req.body;

  const userEmail = await getUserByEmail(email);
  if (userEmail) {
    next(new HttpError('Email sudah digunakan oleh pengguna lain', 409));
    return;
  }

  const userPhoneNumber = await getUserByPhoneNumber(phoneNumber);
  if (userPhoneNumber) {
    next(
      new HttpError('Nomor handphone sudah digunakan oleh pengguna lain', 409),
    );
    return;
  }

  next();
};
