import { HttpError } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import { getUserById } from '../models/User.js';

export const isAdminOrPartner = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new HttpError('Authorization header tidak ditemukan!', 401);
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    throw new HttpError('Tipe authorization salah!', 401);
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await getUserById(id);

    if (!user || (user.role !== 'ADMIN' && user.role !== 'PARTNER')) {
      throw new HttpError('Akses ditolak!', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new HttpError('Token bermasalah!', 401);
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new HttpError('Token kadaluarsa!', 401);
    }

    next(error);
  }
};
