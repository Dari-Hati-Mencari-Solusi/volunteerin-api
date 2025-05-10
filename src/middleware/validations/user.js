import Joi from "joi";
import { generateJoiError } from "../../utils/joi.js";

const PartnerStatus = Object.freeze({
  ACCEPTED_PROFILE: 'ACCEPTED_PROFILE',
  ACCEPTED_LEGALITY: 'ACCEPTED_LEGALITY',
  REJECTED_PROFILE: 'REJECTED_PROFILE',
  REJECTED_LEGALITY: 'REJECTED_LEGALITY'
});

const reviewPartnerUserSchema = Joi.object({
  reviewResult: Joi.string()
    .valid(...Object.values(PartnerStatus))
    .required(),
  information: Joi.string().when('reviewResult', {
    is: Joi.valid(
      PartnerStatus.REJECTED_PROFILE,
      PartnerStatus.REJECTED_LEGALITY,
    ),
    then: Joi.required().messages({
      'any.required': 'Informasi wajib diisi ketika reviewResult adalah REJECTED',
      'string.empty': 'Information tidak boleh kosong ketika status REJECTED.'
    }),
    otherwise: Joi.optional()
  }),
});

export const validateReviewPartnerUser = async (req, res, next) => {
  try {
    await reviewPartnerUserSchema.validateAsync(req.body, {
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