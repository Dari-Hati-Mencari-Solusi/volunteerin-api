import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';

const RegistrantStatus = Object.freeze({
  accepted: 'accepted',
  rejected: 'rejected'
});

const reviewRegistrantSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(RegistrantStatus))
    .required(),
});


export const validateReviewRegistrant = async (req, res, next) => {
  try {
    await reviewRegistrantSchema.validateAsync(req.body, {
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