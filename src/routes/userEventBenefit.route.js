import { Router } from 'express';
import * as authMiddleware from '../middleware/auth.js';
import * as userEventBenefitController from '../controllers/userEventBenefit.controller.js';
import * as accessMiddleware from '../middleware/access.js';
import * as userEventBenefitValidation from '../middleware/validations/userEventBenefit.js';

export default (app) => {
  const router = Router();

  app.use('/user-event-benefits', router);

  // Admin and Partner routes
  router.post(
    '/',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdminOrPartner,
    userEventBenefitValidation.validateUserEventBenefitCreate,
    userEventBenefitController.createUserEventBenefit,
  );

  router.put(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdminOrPartner,
    userEventBenefitValidation.validateUserEventBenefitUpdate,
    userEventBenefitController.updateUserEventBenefit,
  );

  router.delete(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdminOrPartner,
    userEventBenefitController.deleteUserEventBenefit,
  );

  // Public routes
  router.get(
    '/',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdminOrPartner,
    userEventBenefitController.getAllUserEventBenefits,
  );

  router.get(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdminOrPartner,
    userEventBenefitController.getUserEventBenefitById,
  );
};
