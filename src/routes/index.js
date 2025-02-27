import { Router } from 'express';
import auth from './auth.route.js';
import events from './event.route.js';
import partners from './partner.route.js';

export default (app) => {
  const router = Router();

  app.use('/', router);

  auth(router);
  events(router);
  partners(router);
};
