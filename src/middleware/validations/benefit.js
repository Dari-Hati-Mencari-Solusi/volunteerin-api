import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';

const benefitSchema = Joi.object({
  name: Joi.string().max(20).required(),
  icon: Joi.string().max(20).required(),
  description: Joi.string().optional(),
});

export const validateBenefitCreate = async (req, res, next) => {
  try {
    await benefitSchema.validateAsync(req.body, {
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

export const validateBenefitUpdate = async (req, res, next) => {
  try {
    await benefitSchema.validateAsync(req.body, {
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
