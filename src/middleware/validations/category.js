import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';

const categorySchema = Joi.object({
  name: Joi.string().max(40).required(),
  description: Joi.string().allow(''),
}).options({
  stripUnknown: true,
  abortEarly: false,
});

export const validateCategoryCreate = async (req, res, next) => {
  try {
    const { error, value } = categorySchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return generateJoiError(error);
    }

    req.validatedCategoryData = {
      ...value,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const validateCategoryUpdate = async (req, res, next) => {
  try {
    const { error, value } = categorySchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return generateJoiError(error);
    }

    req.validatedCategoryData = {
      ...value,
    };

    next();
  } catch (error) {
    next(error);
  }
};
