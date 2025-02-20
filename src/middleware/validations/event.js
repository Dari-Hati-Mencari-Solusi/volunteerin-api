import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';

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

    req.validatedEventData = {
      ...value,
      startAt: new Date(value.startAt),
      endAt: value.endAt ? new Date(value.endAt) : null,
      latitude: parseFloat(value.latitude),
      longitude: parseFloat(value.longitude),
      categories: value.categories.map(Number),
    };

    next();
  } catch (error) {
    next(error);
  }
};
