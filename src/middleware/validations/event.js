// middleware/validations/event.js
import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';

const EventType = Object.freeze({
  OPEN: 'OPEN',
  INVITE: 'INVITE',
});

const eventSchema = Joi.object({
  title: Joi.string().max(100).required(),
  type: Joi.string()
    .valid(...Object.values(EventType))
    .default('OPEN'),
  description: Joi.string().required(),
  requirement: Joi.string().required(),
  contactPerson: Joi.string().max(15).required(),
  maxApplicant: Joi.number().integer().allow(null),
  acceptedQuota: Joi.number().integer().allow(null),
  startAt: Joi.date().iso().required(),
  endAt: Joi.date().iso().allow(null),
  isPaid: Joi.boolean().default(false),
  price: Joi.when('isPaid', {
    is: true,
    then: Joi.number().precision(2).required(),
    otherwise: Joi.number().precision(2).default(0),
  }),
  province: Joi.string().max(50).required(),
  regency: Joi.string().max(50).required(),
  address: Joi.string().allow(null, ''),
  gmaps: Joi.string().allow(null, ''),
  latitude: Joi.number().precision(8).allow(null),
  longitude: Joi.number().precision(8).allow(null),
  isRelease: Joi.boolean().default(false),
  categoryIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
  benefitIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
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
    } catch (e) {
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
