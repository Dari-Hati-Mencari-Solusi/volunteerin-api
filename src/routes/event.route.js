import { Router } from 'express';
import * as eventController from '../controllers/partner/event.controller.js';

export default (app) => {
  const router = Router();

  app.use('/events', router);

  router.get('/', eventController.getAllEvents);
};
