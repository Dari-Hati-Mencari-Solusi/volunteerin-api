import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';
import { HttpError } from '../../utils/error.js';

const eventSchema = Joi.object({
  title: Joi.string().max(100).required(),
  type: Joi.string().valid('OPEN', 'CLOSED').default('OPEN'),
  description: Joi.string().required(),
  requirement: Joi.string().allow(''),
  contactPerson: Joi.string().max(15).required(),
  maxApplicant: Joi.number().integer().positive().allow(null),
  acceptedQuota: Joi.number().integer().positive().allow(null),
  startAt: Joi.date().required(),
  endAt: Joi.date().greater(Joi.ref('startAt')).allow(null),
  isPaid: Joi.boolean().default(false),
  price: Joi.when('isPaid', {
    is: true,
    then: Joi.number().precision(2).positive().required(),
    otherwise: Joi.number().precision(2).default(0),
  }),
  province: Joi.string().max(50).required(),
  regency: Joi.string().max(50).required(),
  address: Joi.string().allow(''),
  gmaps: Joi.string().allow(''),
  latitude: Joi.number().precision(8).required(),
  longitude: Joi.number().precision(8).required(),
  categories: Joi.alternatives()
    .try(Joi.array().items(Joi.string()).min(1), Joi.string())
    .required(),
  isRelease: Joi.boolean().default(false),
}).options({
  stripUnknown: true,
  abortEarly: false,
});

export const validateEventCreate = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new HttpError('Banner event harus diunggah!', 400);
    }

    // Validasi ukuran gambar (bisa ditambahkan validasi dimensi jika diperlukan)
    if (req.file.size > 1 * 1024 * 1024) {
      // 1MB
      throw new HttpError('Ukuran banner maksimal 1MB', 400);
    }

    const { error, value } = eventSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return generateJoiError(error);
    }

    let categories = value.categories;
    if (typeof categories === 'string') {
      categories = categories.split(',');
    }

    req.validatedEventData = {
      ...value,
      startAt: new Date(value.startAt),
      endAt: value.endAt ? new Date(value.endAt) : null,
      categories,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const validateEventUpdate = async (req, res, next) => {
  try {
    const { error, value } = eventSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return generateJoiError(error);
    }

    let categories = value.categories;
    if (typeof categories === 'string') {
      categories = categories.split(',').map(Number);
    } else if (Array.isArray(categories)) {
      categories = categories.map(Number);
    } else {
      throw new HttpError('Format categories tidak valid', 400);
    }

    req.validatedEventData = {
      ...value,
      startAt: new Date(value.startAt),
      endAt: value.endAt ? new Date(value.endAt) : null,
      latitude: parseFloat(value.latitude),
      longitude: parseFloat(value.longitude),
      categories: categories,
    };

    next();
  } catch (error) {
    next(error);
  }
};
