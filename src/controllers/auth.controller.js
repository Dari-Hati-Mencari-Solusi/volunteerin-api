import { sendEmail } from '../configs/mailConfig.js';
import * as userModel from '../models/User.js';
import * as cryptos from '../utils/crypto.js';
import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/error.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  const { name, email, password, phoneNumber, role } = req.body;

  try {
    const hashingPassword = await cryptos.hashPassword(password);

    const user = await userModel.createUser({
      name,
      email,
      password: hashingPassword,
      phoneNumber,
      role,
      createdAt: new Date(),
    });

    const payload = { id: user.id };
    const token = generateToken(payload, '30m');

    const sender = {
      address: user.email,
      name: user.name,
    };
    const recipients = ['volunteerinbusiness@gmail.com'];
    const verifyUrl = `${process.env.FE_BASE_URL}/verify-email?t=${token}`;
    const subject = `Verifikasi Akun Volunteerin ${role === 'PARTNER' ? 'Partner' : ''} kamu`;

    await sendEmail(
      sender,
      recipients,
      subject,
      `<p>Your verification url: <a href="${verifyUrl}">Klik disini</a></p>`,
    );

    res.status(200).json({
      message: 'Akun berhasil dibuat',
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  const { password: plainPassword } = req.body;
  const { user } = req;
  const { password: hashingPassword } = user;

  try {
    const isMatch = await cryptos.comparePassword(
      plainPassword,
      hashingPassword,
    );

    if (!isMatch) {
      return next(new HttpError('Maaf, akun tidak ditemukan.', 404));
    }

    const payload = { id: user.id };
    const token = generateToken(payload, '1d');

    await userModel.logUserLogin(user.id);

    res.status(200).json({
      message: 'Anda berhasil masuk.',
      data: { token, user },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { id: userId } = decoded;

    await userModel.verifyUser(userId);

    return res.status(200).json({
      message: 'Verifikasi akun berhasil! Akun Anda sekarang sudah aktif',
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(
        new HttpError(
          'Link kamu sudah kedaluwarsa. Silakan kirim ulang email verifikasi untuk melanjutkan.',
          401,
        ),
      );
    }

    return next(error);
  }
};

export const resendEmailVerification = async (req, res, next) => {
  const { user } = req;
  try {
    const payload = { id: user.id };
    const token = generateToken(payload, '30m');

    const sender = {
      address: user.email,
      name: user.name,
    };
    const recipients = ['volunteerinbusiness@gmail.com'];
    const verifyUrl = `${process.env.FE_BASE_URL}/verify-email?t=${token}`;
    const subject = `Verifikasi Akun Volunteerin ${user.email === 'PARTNER' ? 'Partner' : ''} kamu`;
    await sendEmail(
      sender,
      recipients,
      subject,
      `<p>Your verification url: <a href="${verifyUrl}">Klik disini</a></p>`,
    );

    res.status(200).json({
      message:
        'Email verifikasi telah berhasil dikirim. Silahkan cek email Anda',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { user } = req;

  try {
    const payload = { id: user.id };
    const token = generateToken(payload, '30m');

    const sender = {
      address: user.email,
      name: user.name,
    };
    const recipients = ['volunteerinbusiness@gmail.com'];
    const verifyUrl = `${process.env.FE_BASE_URL}/reset-pw?t=${token}`;
    const subject = `Reset Password`;
    await sendEmail(
      sender,
      recipients,
      subject,
      `<p>Your reset password url: <a href="${verifyUrl}">Klik disini</a></p>`,
    );

    res.status(200).json({
      message: 'Link reset password telah dikirim di email Anda.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, password: newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { id: userId } = decoded;

    const hashingPassword = await cryptos.hashPassword(newPassword);

    const user = await userModel.updatePassword(userId, hashingPassword);

    return res.status(200).json({
      message:
        'Password berhasil diperbarui. Silakan login dengan password baru Anda',
      data: user,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(
        new HttpError(
          'Link kamu sudah kedaluwarsa. Silakan lakukan reset password kembali.',
          401,
        ),
      );
    }

    return next(error);
  }
};

export const me = async (req, res, _next) => {
  const { user } = req;

  res.status(200).json({
    message: 'success',
    data: user,
  });
};
