import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as oauthController from '../controllers/oauth.controller.js';
import * as userMiddleware from '../middleware/user.js';
import * as authMiddleware from '../middleware/auth.js';
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

  router.post(
    '/login',
    authValidation.loginValidation,
    userMiddleware.checkUserExist,
    userMiddleware.checkUserVerified,
    authController.login,
  );

  router.post(
    '/verify-email',
    authValidation.verifyEmailValidation,
    authController.verifyEmail,
  );

  router.post(
    '/verify-email/resend',
    authValidation.resendEmailVerificationValidation,
    userMiddleware.checkUserExist,
    authController.resendEmailVerification,
  );

  router.post(
    '/forgot-password',
    authValidation.forgotPasswordValidation,
    userMiddleware.checkUserExist,
    authController.forgotPassword,
  );

  router.post(
    '/reset-password',
    authValidation.resetPasswordValidation,
    authController.resetPassword,
  );

  router.get('/google', oauthController.loginGoogle);

  router.get('/google/callback', oauthController.callbackLoginGoogle);

  router.get('/me', authMiddleware.isAuthenticate, authController.me);
};
