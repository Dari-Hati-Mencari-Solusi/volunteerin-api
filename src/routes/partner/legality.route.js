import { Router } from "express";
import * as authMiddleware from '../../middleware/auth.js';
import * as accessMiddleware from '../../middleware/access.js';
import * as uploadMiddleware from "../../middleware/upload.js";
import * as partnerProfileMiddleware from "../../middleware/partnerProfile.js";
import * as legalityValidation from "../../middleware/validations/legality.js";
import * as legalityController from "../../controllers/partner/legality.controller.js";

export default (app) => {
  const router = Router();

  app.use("/partners/me", router);
  
  router.post(
    '/legality',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    uploadMiddleware.uploadSingle(
      'document',
      '1MB',
      ['application/pdf'],
      'File yang diunggah harus dalam format pdf',
    ),
    partnerProfileMiddleware.ensurePartnerProfileExists,
    legalityValidation.validateLegalityCreate,
    legalityController.createLegality
  );

  router.get(
    '/legality',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    legalityController.getLegality
  );
}