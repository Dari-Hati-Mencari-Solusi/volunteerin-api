import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';

const Role = Object.freeze({
  VOLUNTEER: 'VOLUNTEER',
  PARNTER: 'PARTNER',
  ADMIN: 'ADMIN',
});

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(125).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(12).required(),
  phoneNumber: Joi.string()
    .pattern(/^(62)8[1-9][0-9]{6,10}$/)
    .required(),
  role: Joi.string()
    .valid(...Object.values(Role))
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string()
    .valid(...Object.values(Role))
    .required(),
});

export const registerValidation = async (req, res, next) => {
  try {
    await registerSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const customErrors = {
      phoneNumber:
        'Nomor telepon harus dimulai dengan 62 dan sesuai format nomor Indonesia',
    };
    return res.status(400).json({
      message: generateJoiError(error, customErrors),
    });
  }
};

export const loginValidation = async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({
      message: generateJoiError(error),
    });
  }
};
