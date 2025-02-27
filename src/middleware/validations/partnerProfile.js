import Joi from 'joi';
import { generateJoiError } from '../../utils/joi.js';

const partnerProfileSchema = Joi.object({
  organizationType: Joi.string()
    .valid('PERSONAL', 'ORGANIZATION', 'COMPANY')
    .required(),
  organizationAddress: Joi.string().required(),
  instagram: Joi.string().max(50).required(),
  information: Joi.string().allow('', null),
  eventQuota: Joi.number().integer().min(1),
  status: Joi.string().valid('REVIEWED', 'APPROVED', 'REJECTED'),
}).options({
  stripUnknown: true,
  abortEarly: false,
});

export const validatePartnerProfileCreate = async (req, res, next) => {
  try {
    const { error, value } = partnerProfileSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return generateJoiError(error);
    }

    // Hapus field yang tidak boleh diubah oleh partner
    if (req.user.role !== 'ADMIN') {
      delete value.eventQuota;
      delete value.status;
    }

    req.validatedPartnerData = value;
    next();
  } catch (error) {
    next(error);
  }
};

export const validatePartnerProfileUpdate = async (req, res, next) => {
  try {
    const { error, value } = partnerProfileSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return generateJoiError(error);
    }

    req.validatedPartnerData = value;
    next();
  } catch (error) {
    next(error);
  }
};
