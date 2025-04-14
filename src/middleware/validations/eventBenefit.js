import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';

const eventBenefitSchema = Joi.object({
  name: Joi.string().max(20).required(),
  icon: Joi.string().max(20).required(),
  description: Joi.string().optional(),
});

export const validateEventBenefitCreate = async (req, res, next) => {
  try {
    await eventBenefitSchema.validateAsync(req.body, {
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

export const validateEventBenefitUpdate = async (req, res, next) => {
  try {
    await eventBenefitSchema.validateAsync(req.body, {
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
