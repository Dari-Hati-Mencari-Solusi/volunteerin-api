import { Router } from 'express';
import * as eventController from '../controllers/partner/event.controller.js';
import * as authMiddleware from '../middleware/auth.js';
import * as eventMiddleware from '../middleware/event.js';

export default (app) => {
  const router = Router();

  app.use('/events', router);

  router.get('/', eventController.getAllEvents);
  router.get(
    '/:id',
    authMiddleware.isAuthenticate,
    eventMiddleware.ensureEventIsReleased,
    eventController.getEvent,
  );
};
