import { Router } from 'express';
import * as eventController from '../controllers/event.controller.js';
import * as eventMiddleware from '../middleware/event.js';
import * as eventValidation from '../middleware/validations/event.js';
import uploadMiddleware from '../utils/multer.js';

export default (app) => {
  const router = Router();

  app.use('/events', router);

  router.post(
    '/',
    eventMiddleware.isAdminOrPartner,
    uploadMiddleware,
    eventValidation.validateEventCreate,
    eventController.createEvent,
  );

  router.put(
    '/:id',
    eventMiddleware.isAdminOrPartner,
    uploadMiddleware,
    eventValidation.validateEventUpdate,
    eventController.updateEvent,
  );

  router.delete(
    '/:id',
    eventMiddleware.isAdminOrPartner,
    eventController.deleteEvent,
  );

  //public api
  router.get('/', eventController.getAllEvents);
  router.get('/:id', eventController.getEventById);
};
