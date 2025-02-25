import { Router } from 'express';
import * as authMiddleware from '../middleware/auth.js';
import * as eventController from '../controllers/event.controller.js';
import * as accessMiddleware from '../middleware/access.js';
import * as eventValidation from '../middleware/validations/event.js';
import uploadMiddleware from '../utils/multer.js';

export default (app) => {
  const router = Router();

  app.use('/events', router);

  router.post(
    '/',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdminOrPartner,
    uploadMiddleware,
    eventValidation.validateEventCreate,
    eventController.createEvent,
  );

  router.put(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdminOrPartner,
    uploadMiddleware,
    eventValidation.validateEventUpdate,
    eventController.updateEvent,
  );

  router.delete(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdminOrPartner,
    eventController.deleteEvent,
  );

  //public api
  router.get('/', eventController.getAllEvents);
  router.get('/:id', eventController.getEventById);
};
