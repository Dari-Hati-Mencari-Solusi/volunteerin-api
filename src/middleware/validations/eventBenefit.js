import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';

const eventBenefitSchema = Joi.object({
  eventId: Joi.string().uuid().required(),
  benefitId: Joi.string().uuid().required(),
}).options({
  stripUnknown: true,
  abortEarly: false,
});

export const validateEventBenefitCreate = async (req, res, next) => {
  try {
    const { error, value } = eventBenefitSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: 'Terjadi kesalahan validasi',
        errors: generateJoiError(error),
      });
    }

    req.body = value;
    next();
  } catch (error) {
    next(error);
  }
};

export const validateEventBenefitUpdate = async (req, res, next) => {
  try {
    const { error, value } = eventBenefitSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: 'Terjadi kesalahan validasi',
        errors: generateJoiError(error),
      });
    }

    req.body = value;
    next();
  } catch (error) {
    next(error);
  }
};
