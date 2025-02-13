import { Router } from 'express';
import auth from './auth.route.js';
import events from './event.route.js';

export default (app) => {
  const router = Router();

  app.use('/api', router);

  auth(router);
  events(router);
};
