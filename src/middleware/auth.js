import jwt from 'jsonwebtoken';
import { getUserById } from '../models/User.js';

export const isAuthenticate = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authorization header tidak ditemukan!',
    });
  }

  const [type, token] = authorization.split(' ');

  if (type.toLocaleLowerCase() !== 'bearer') {
    return res.status(401).json({
      message: 'Tipe authorization salah!',
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await getUserById(id);

    if (!user) {
      return res.status(400).json({ message: 'User tidak ditemukan!' });
    }

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: 'Token bermasalah!',
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token kadaluarsa!' });
    }

    next(error);
  }
};
