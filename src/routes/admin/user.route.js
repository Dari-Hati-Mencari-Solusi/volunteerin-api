import { Router } from 'express';
import * as authMiddleware from '../../middleware/auth.js';
import * as accessMiddleware from '../../middleware/access.js';
import * as userController from '../../controllers/user.controller.js';
import * as userValidation from "../../middleware/validations/user.js"

export default (app) => {
  const router = Router();

  app.use('/admins/me', router);

  router.get(
    '/users',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdmin,
    userController.getUsers
  );

  router.get(
    '/users/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdmin,
    userController.getDetailUser
  );

  router.patch(
    '/users/:id/review',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdmin,
    userValidation.validateReviewPartnerUser,
    userController.reviewPartnerUser
  );
};