import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';

const legalitySchema = Joi.object({
  documentName: Joi.string().required(),
  infomation: Joi.string()
});

export const validateLegalityCreate = async (req, res, next) => {
  try {
    await legalitySchema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Terjadi kesalahan',
      errors: generateJoiError(error),
    });
  }
};
