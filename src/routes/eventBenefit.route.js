import { Router } from 'express';
import * as authMiddleware from '../../middleware/auth.js';
import * as accessMiddleware from '../../middleware/access.js';
import * as eventBenefitController from '../../controllers/admin/eventBenefit.controller.js';
import * as eventBenefitValidation from '../../middleware/validations/eventBenefit.js';

export default (app) => {
  const router = Router();

  app.use('/admin/event-benefits', router);

  // Admin-only route for creating event benefits
  router.post(
    '/',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdmin, // Ensures only admin has access
    eventBenefitValidation.validateEventBenefitCreate,
    eventBenefitController.createEventBenefit,
  );

  // Admin-only route for getting all event benefits
  router.get(
    '/',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdmin, // Ensures only admin has access
    eventBenefitController.getEventBenefits,
  );

  // Admin-only route for updating event benefit by id
  router.put(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdmin, // Ensures only admin has access
    eventBenefitValidation.validateEventBenefitUpdate,
    eventBenefitController.updateEventBenefit,
  );

  // Admin-only route for deleting event benefit by id
  router.delete(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdmin, // Ensures only admin has access
    eventBenefitController.deleteEventBenefit,
  );
};
