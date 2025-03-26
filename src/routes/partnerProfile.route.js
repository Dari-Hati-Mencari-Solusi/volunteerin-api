import { Router } from 'express';
import * as authMiddleware from '../middleware/auth.js';
import * as accessMiddleware from '../middleware/access.js';
import * as uploadMiddleware from '../middleware/upload.js';
import * as imageMiddleware from '../middleware/image.js';
import * as partnerProfileController from '../controllers/partner/partnerProfile.controller.js';
import * as partnerProfileValidation from '../middleware/validations/partnerProfile.js';

export default (app) => {
  const router = Router();

  app.use('/partners', router);

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
    imageMiddleware.maxDimensionOfFile(500, 500),
    partnerProfileValidation.validatePartnerProfileCreate,
    partnerProfileController.createPartnerProfile,
  );
};
