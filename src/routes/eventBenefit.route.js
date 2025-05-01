import { Router } from 'express';
import * as authMiddleware from '../middleware/auth.js';
import * as eventBenefitController from '../controllers/eventBenefit.controller.js';
import * as accessMiddleware from '../middleware/access.js';
import * as eventBenefitValidation from '../middleware/validations/eventBenefit.js';

export default (app) => {
  const router = Router();

  app.use('/event-benefits', router);

  // Admin dan Partner routes
  router.post(
    '/',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdminOrPartner,
    eventBenefitValidation.validateEventBenefitCreate,
    eventBenefitController.createEvent,
  );

  router.put(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdminOrPartner,
    eventBenefitValidation.validateEventBenefitUpdate,
    eventBenefitController.updateEvent,
  );

  router.delete(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdminOrPartner,
    eventBenefitController.deleteEvent,
  );

  // Public routes
  router.get(
    '/',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdminOrPartner,
    eventBenefitController.getEvent,
  );

  // router.get(
  //   '/:id',
  //   authMiddleware.isAuthenticate,
  //   accessMiddleware.isAdminOrPartner,
  //   eventBenefitController.getEventBenefitById,
  // );
};
