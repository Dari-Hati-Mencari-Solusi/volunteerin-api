import { Router } from 'express';
import * as eventController from '../controllers/event.controller.js';
import * as eventMiddleware from '../middleware/event.js';
import * as eventValidation from '../middleware/validations/event.js';
import upload from '../utils/multer.js';

export default (app) => {
  const router = Router();

  app.use('/events', router);

  router.post(
    '/',
    eventMiddleware.isAdminOrPartner,
    upload.single('banner'),
    eventValidation.validateEventCreate,
    eventController.createEvent,
  );

  // Public routes
  router.get('/', eventController.getAllEvents);
};
