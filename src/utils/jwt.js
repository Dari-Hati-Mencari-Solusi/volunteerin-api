import jwt from 'jsonwebtoken';

export const generateToken = (payload, expiredToken) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: expiredToken,
  });
};
