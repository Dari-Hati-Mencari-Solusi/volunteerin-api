import { Router } from 'express';
import * as authMiddleware from '../../middleware/auth.js';
import * as accessMiddleware from '../../middleware/access.js';
import * as uploadMiddleware from '../../middleware/upload.js';
import * as imageMiddleware from '../../middleware/image.js';
import * as partnerProfileController from '../../controllers/partner/partnerProfile.controller.js';
import * as partnerProfileValidation from '../../middleware/validations/partnerProfile.js';
import * as partnerProfileMiddleware from '../../middleware/partnerProfile.js';

export default (app) => {
  const router = Router();

  app.use('/partners/me', router);

  router.post(
    '/profile',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    uploadMiddleware.uploadSingle(
      'logo',
      '200KB',
      ['image/png', 'image/jpg', 'image/jpeg'],
      'File yang diunggah harus dalam format PNG, JPG, atau JPEG.',
    ),
    partnerProfileMiddleware.ensureNoPartnerProfileExists,
    imageMiddleware.maxDimensionOfFile(500, 500),
    partnerProfileValidation.validatePartnerProfileCreate,
    partnerProfileController.createPartnerProfile,
  );

  router.get(
    '/profile',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    partnerProfileController.getPartnerProfile
  );

  router.put(
    '/profile',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    uploadMiddleware.uploadSingle(
      'logo',
      '200KB',
      ['image/png', 'image/jpg', 'image/jpeg'],
      'File yang diunggah harus dalam format PNG, JPG, atau JPEG.',
    ),
    partnerProfileMiddleware.ensurePartnerProfileExists,
    imageMiddleware.maxDimensionOfFile(500, 500),
    partnerProfileValidation.validatePartnerProfileUpdate,
    partnerProfileController.updatePartnerProfile
  );
};
