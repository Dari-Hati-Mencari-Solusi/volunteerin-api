import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';

const eventSchema = Joi.object({
  title: Joi.string().max(100).required(),
  startAt: Joi.date().required(),
  endAt: Joi.date().greater(Joi.ref('startAt')),
  bannerUrl: Joi.string().required(),
  description: Joi.string().required(),
  termsAndConditions: Joi.string(),
  isRelease: Joi.boolean(),
  contactPerson: Joi.string().max(15).required(),
  location: Joi.string().required(),
  latitude: Joi.number().precision(8).required(),
  longitude: Joi.number().precision(8).required(),
  categories: Joi.array().items(Joi.number()).min(1).required(),
});

export const eventValidation = async (req, res, next) => {
  try {
    await eventSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({
      message: generateJoiError(error),
    });
  }
};
