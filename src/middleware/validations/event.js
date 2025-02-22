import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';
import { HttpError } from '../../utils/error.js';

const eventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  startAt: Joi.date().required(),
  endAt: Joi.date().greater(Joi.ref('startAt')),
  termsAndConditions: Joi.string().allow(''),
  contactPerson: Joi.string().required(),
  location: Joi.string().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  categories: Joi.alternatives()
    .try(Joi.array().items(Joi.number()).min(1), Joi.string())
    .required(),
  isRelease: Joi.boolean().default(false),
}).options({
  stripUnknown: true,
  abortEarly: false,
});

export const validateEventCreate = async (req, res, next) => {
  try {
    if (!req.file && !req.files) {
      return res.status(400).json({
        message: 'Banner event harus diunggah!',
      });
    }

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
