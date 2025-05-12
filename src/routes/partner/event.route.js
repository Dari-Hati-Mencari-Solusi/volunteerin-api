import { Router } from 'express';
import * as authMiddleware from '../../middleware/auth.js';
import * as accessMiddleware from '../../middleware/access.js';
import * as uploadMiddleware from '../../middleware/upload.js';
import * as imageMiddleware from '../../middleware/image.js';
import * as eventController from '../../controllers/event.controller.js';
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
    '/events',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    eventController.getEvents,
  );

  router.get(
    '/events/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    eventMiddleware.ensureEventOwner,
    eventController.getEvent,
  );

  router.patch(
    '/events/:id',
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
    imageMiddleware.maxDimensionOfFile(600, 300),
    eventValidation.validateEventUpdate,
    eventController.updateEvent,
  );

  router.delete(
    '/events/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    eventMiddleware.ensureEventOwner,
    eventController.deleteEvent,
  );
};
