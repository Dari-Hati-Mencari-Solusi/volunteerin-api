import Joi from "joi";
import { generateJoiError } from "../../utils/joi.js";


const responsiblePersonSchema = Joi.object({
  nik: Joi.string().max(30).required(),
  fullName: Joi.string().max(125).required(),
  phoneNumber: Joi.string().min(11).max(20),
  position: Joi.string().max(50).required(),
});

export const validateResponsiblePersonCreate = async (req, res, next) => {
  try {
    await responsiblePersonSchema.validateAsync(req.body, { 
      abortEarly: false,
      stripUnknown: true
    })
    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Terjadi kesalahan',
      errors: generateJoiError(error),
    });
  }
}