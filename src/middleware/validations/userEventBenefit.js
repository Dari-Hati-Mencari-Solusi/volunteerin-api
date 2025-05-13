import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';

const userEventBenefitSchema = Joi.object({
  userId: Joi.string().uuid().allow(null),
  eventId: Joi.string().uuid().required(),
  customIcon: Joi.string().max(15).allow('', null),
  customBenefit: Joi.string().max(15).allow('', null),
}).options({
  stripUnknown: true,
  abortEarly: false,
});

export const validateUserEventBenefitCreate = async (req, res, next) => {
  try {
    const { error, value } = userEventBenefitSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: 'Terjadi kesalahan validasi',
        errors: generateJoiError(error),
      });
    }

    req.validatedUserEventBenefitData = {
      ...value,
      userId: value.userId || null,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const validateUserEventBenefitUpdate = async (req, res, next) => {
  try {
    const { error, value } = userEventBenefitSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: 'Terjadi kesalahan validasi',
        errors: generateJoiError(error),
      });
    }

    req.validatedUserEventBenefitData = {
      ...value,
      userId: value.userId || null,
    };

    next();
  } catch (error) {
    next(error);
  }
};
