import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';

const formSchema = Joi.object({
  eventId: Joi.string().uuid().required(),
  content: Joi.object().required(),
});

export const validateFormCreate = async (req, res, next) => {
  try {
    await formSchema.validateAsync(req.body, {
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

export const validateFormUpdate = async (req, res, next) => {
  try {
    const updateSchema = Joi.object({
      content: Joi.object().required(),
    });

    await updateSchema.validateAsync(req.body, {
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
