import { Router } from 'express';
import multer from 'multer';
const upload = multer();
import * as authMiddleware from '../../middleware/auth.js';
import * as accessMiddleware from '../../middleware/access.js';
import * as formController from '../../controllers/partner/form.controller.js';
import * as formValidation from '../../middleware/validations/form.js';
import * as formMiddleware from '../../middleware/form.js';
import * as partnerStatusMiddleware from '../../middleware/partnerStatus.js';

export default (app) => {
  const router = Router();

  app.use('/partner/me/forms', router);

  // Partner routes
  router.get(
    '/',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    formController.getMyForms,
  );

  router.post(
    '/',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    upload.none(),
    formValidation.validateFormCreate,
    partnerStatusMiddleware.isProfileAccepted,
    formController.createForm,
  );

  router.patch(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    formValidation.validateFormUpdate,
    partnerStatusMiddleware.isProfileAccepted,
    formMiddleware.ensureFormOwner,
    formController.updateForm,
  );

  // router.delete(
  //   '/:id',
  //   authMiddleware.isAuthenticate,
  //   accessMiddleware.isPartner,
  //   formMiddleware.ensureFormOwner,
  //   formController.deleteForm,
  // );
};
