import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as userMiddleware from '../middleware/user.js';
import * as authValidation from '../middleware/validations/auth.js';

export default (app) => {
  const router = Router();

  app.use('/auth', router);

  router.post(
    '/register',
    authValidation.registerValidation,
    userMiddleware.checkEmailandPhoneNumberExist,
    authController.register,
  );

  router.post('/login', authValidation.loginValidation);
};
