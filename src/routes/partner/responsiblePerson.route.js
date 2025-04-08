import { Router } from "express";
import * as authMiddleware from '../../middleware/auth.js';
import * as accessMiddleware from '../../middleware/access.js';
import * as responsiblePersonValidation from "../../middleware/validations/responsiblePerson.js"
import * as uploadMiddleware from "../../middleware/upload.js";
import * as partnerProfileMiddleware from "../../middleware/partnerProfile.js";
import * as responsiblePersonMiddleware from "../../middleware/responsiblePerson.js";
import * as responsiblePersonController from "../../controllers/partner/responsiblePerson.controller.js"

export default (app) => {
  const router = Router();

  app.use("/partners/me", router);
  
  router.post(
    '/responsible-person',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    uploadMiddleware.uploadSingle(
      'ktp',
      '300KB',
      ['image/png', 'image/jpg', 'image/jpeg'],
      'File yang diunggah harus dalam format PNG, JPG, atau JPEG.',
    ),
    partnerProfileMiddleware.ensurePartnerProfileExists,
    responsiblePersonMiddleware.ensureNoResponsiblePersonExists,
    responsiblePersonValidation.validateResponsiblePersonCreate,
    responsiblePersonController.createResponsiblePerson
  );

  router.get(
    '/responsible-person',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    responsiblePersonController.getResponsiblePerson
  );

  router.put(
    '/responsible-person',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    uploadMiddleware.uploadSingle(
      'ktp',
      '300KB',
      ['image/png', 'image/jpg', 'image/jpeg'],
      'File yang diunggah harus dalam format PNG, JPG, atau JPEG.',
    ),
    partnerProfileMiddleware.ensurePartnerProfileExists,
    responsiblePersonMiddleware.ensureResponsiblePersonExists,
    responsiblePersonValidation.validateResponsiblePersonCreate,
    responsiblePersonController.updateResponsiblePerson
  );
}