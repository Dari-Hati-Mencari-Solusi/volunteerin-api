import { Router } from 'express';
import multer from 'multer';
const upload = multer();
import * as authMiddleware from '../middleware/auth.js';
import * as accessMiddleware from '../middleware/access.js';
import * as benefitController from '../controllers/benefit.controller.js';
import * as benefitValidation from '../middleware/validations/benefit.js';
import { Roles } from '../constants/roles.js';

export default (app) => {
  const router = Router();

  app.use('/benefits', router);

  // Admin dan Partner routes
  router.post(
    '/',
    authMiddleware.isAuthenticate,
    accessMiddleware.authorize([Roles.ADMIN, Roles.PARTNER]),
    upload.none(),
    benefitValidation.validateBenefitCreate,
    benefitController.createBenefit,
  );

  router.get('/', authMiddleware.isAuthenticate, benefitController.getBenefits);

  router.get(
    '/my-benefits',
    authMiddleware.isAuthenticate,
    accessMiddleware.authorize([Roles.ADMIN, Roles.PARTNER]),
    benefitController.getMyBenefits,
  );

  router.put(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.authorize([Roles.ADMIN, Roles.PARTNER]),
    benefitValidation.validateBenefitUpdate,
    benefitController.updateBenefit,
  );

  router.delete(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.authorize([Roles.ADMIN, Roles.PARTNER]),
    benefitController.deleteBenefit,
  );
};
