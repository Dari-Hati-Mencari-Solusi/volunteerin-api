import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';

const OrganizationType = Object.freeze({
  COMMUNITY: 'COMMUNITY',
  GOVERNMENT: 'GOVERNMENT',
  CORPORATE: 'CORPORATE',
  FOUNDATION: 'FOUNDATION',
  INDIVIDUAL: 'INDIVIDUAL',
  UNIVERSITY: 'UNIVERSITY',
});

const partnerProfileSchema = Joi.object({
  organizationType: Joi.string()
    .valid(...Object.values(OrganizationType))
    .required(),
  organizationAddress: Joi.string().required(),
  instagram: Joi.string().max(50).required(),
});

export const validatePartnerProfileCreate = async (req, res, next) => {
  try {
    await partnerProfileSchema.validateAsync(req.body, {
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

export const validatePartnerProfileUpdate = async (req, res, next) => {
  try {
    await partnerProfileSchema.validateAsync(req.body, {
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
