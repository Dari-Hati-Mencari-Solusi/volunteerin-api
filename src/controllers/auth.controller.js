import * as userModel from '../models/User.js';
import * as cryptos from '../utils/crypto.js';

export const register = async (req, res, _next) => {
  const { name, email, password, phoneNumber, role } = req.body;

  const hashingPassword = await cryptos.hashPassword(password);

  const user = userModel.createUser({
    name,
    email,
    password: hashingPassword,
    phoneNumber,
    role,
  });

  res.status(200).json({
    message: 'Akun berhasil dibuat',
    data: user,
  });
};

export const login = async (req, res, _next) => {
  const { email, password, role } = req.body;

  const user = userModel.getUserByEmail(email, role);

  res.status(200).json({
    message: 'Kamu berhasil masuk',
    data: user,
  });
};
