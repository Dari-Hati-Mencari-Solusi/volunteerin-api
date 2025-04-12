import { Router } from 'express';
import * as authMiddleware from '../../middleware/auth.js';
import * as accessMiddleware from '../../middleware/access.js';
import * as uploadMiddleware from '../../middleware/upload.js';
import * as imageMiddleware from '../../middleware/image.js';
import * as eventController from '../../controllers/partner/event.controller.js';
import * as eventValidation from '../../middleware/validations/event.js';
import * as partnerProfileMiddleware from '../../middleware/partnerProfile.js';
import * as eventMiddleware from '../../middleware/event.js';

export default (app) => {
  const router = Router();

  app.use('/partners/me', router);

  router.post(
    '/events',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    partnerProfileMiddleware.ensurePartnerProfileExists,
    uploadMiddleware.uploadSingle(
      'banner',
      '1MB',
      ['image/png', 'image/jpg', 'image/jpeg'],
      'File yang diunggah harus dalam format PNG, JPG, atau JPEG.',
    ),
    imageMiddleware.maxDimensionOfFile(600, 300),
    eventValidation.validateEventCreate,
    eventController.createEvent,
  );

  router.get(
    '/',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    eventController.getEvents,
  );

  router.get(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    eventMiddleware.ensureEventOwner,
    eventController.getEvent,
  );

  router.patch(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    partnerProfileMiddleware.ensurePartnerProfileExists,
    eventMiddleware.ensureEventOwner,
    uploadMiddleware.uploadSingle(
      'banner',
      '1MB',
      ['image/png', 'image/jpg', 'image/jpeg'],
      'File yang diunggah harus dalam format PNG, JPG, atau JPEG.',
    ),
    imageMiddleware.maxDimensionOfFile(300, 600),
    eventValidation.validateEventUpdate,
    eventController.updateEvent,
  );

  router.delete(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    eventMiddleware.ensureEventOwner,
    eventController.deleteEvent,
  );
};
