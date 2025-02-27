import { Router } from 'express';
import * as authMiddleware from '../middleware/auth.js';
import * as accessMiddleware from '../middleware/access.js';
import * as partnerProfileController from '../controllers/partnerProfile.controller.js';
import * as partnerProfileValidation from '../middleware/validations/partnerProfile.js';

export default (app) => {
  const router = Router();

  app.use('/partner-profiles', router);

  // Endpoint bagi partner untuk mengelola profile mereka sendiri
  router.get(
    '/me',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    partnerProfileController.getMyPartnerProfile,
  );

  router.post(
    '/',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    partnerProfileValidation.validatePartnerProfileCreate,
    partnerProfileController.createPartnerProfile,
  );

  // Endpoint untuk CRUD yang membutuhkan parameter ID
  router.get(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdminOrPartner,
    partnerProfileController.getPartnerProfileById,
  );

  router.put(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdminOrPartner,
    partnerProfileValidation.validatePartnerProfileUpdate,
    partnerProfileController.updatePartnerProfile,
  );

  router.delete(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdminOrPartner,
    partnerProfileController.deletePartnerProfile,
  );

  // Admin-only endpoint untuk melihat semua partner profiles
  router.get(
    '/',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdmin,
    partnerProfileController.getAllPartnerProfiles,
  );
};
