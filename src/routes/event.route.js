import { Router } from 'express';
import * as eventController from '../controllers/event.controller.js';

export default (app) => {
  const router = Router();

  app.use('/events', router);

  // Public routes
  router.get('/', eventController.getAllEvents);
};
