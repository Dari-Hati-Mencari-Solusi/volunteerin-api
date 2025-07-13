import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';

const EventType = Object.freeze({
  OPEN: 'OPEN',
  LIMITED: 'LIMITED',
});

const eventSchema = Joi.object({
  title: Joi.string().max(100).required(),
  type: Joi.string()
    .valid(...Object.values(EventType))
    .default('OPEN')
    .required(),
  description: Joi.string().required(),
  requirement: Joi.string().required(),
  contactPerson: Joi.string().max(15).required(),
  maxApplicant: Joi.number().integer().optional(),
  acceptedQuota: Joi.number().integer().optional(),
  startAt: Joi.date().iso().required(),
  endAt: Joi.date().iso().required(),
  isPaid: Joi.boolean().default(false),
  price: Joi.when('isPaid', {
    is: true,
    then: Joi.number().precision(2).required(),
    otherwise: Joi.number().precision(2).default(0),
  }),
  province: Joi.string().max(50).required(),
  regency: Joi.string().max(50).required(),
  address: Joi.string().required(),
  gmaps: Joi.string().optional(),
  latitude: Joi.number().precision(8).optional(),
  longitude: Joi.number().precision(8).optional(),
  isRelease: Joi.boolean().default(false).required(),
  categoryIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
  benefitIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
});

const submitRegistrationSchema = Joi.object({
  formId: Joi.string().uuid().required(),
  answers: Joi.object().required(),
});

/**
 * Memproses array dari form-data
 * @param {any} value - Nilai yang akan diproses
 * @returns {Array} Array yang sudah diproses
 */
const processArrayFromFormData = (value) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (_e) {
      return value.split(',');
    }
  }
  return value;
};

/**
 * Validasi untuk pembuatan event
 */
export const validateEventCreate = async (req, res, next) => {
  try {
    // Proses benefitIds dan categoryIds dari form-data
    req.body.benefitIds = processArrayFromFormData(req.body.benefitIds);
    req.body.categoryIds = processArrayFromFormData(req.body.categoryIds);

    // Validasi schema
    await eventSchema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Terjadi kesalahan pada validasi event',
      errors: generateJoiError(error),
    });
  }
};

/**
 * Validasi untuk update event
 */
export const validateEventUpdate = async (req, res, next) => {
  try {
    // Proses benefitIds dan categoryIds dari form-data
    req.body.benefitIds = processArrayFromFormData(req.body.benefitIds);
    req.body.categoryIds = processArrayFromFormData(req.body.categoryIds);

    // Validasi schema
    await eventSchema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Terjadi kesalahan pada validasi event',
      errors: generateJoiError(error),
    });
  }
};

export const validateSubmitRegistration = async (req, res, next) => {
  try {
    await submitRegistrationSchema.validateAsync(req.body, {
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
