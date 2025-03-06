import { Router } from 'express';
import auth from './auth.route.js';
import events from './event.route.js';
import partners from './partnerProfile.route.js';
import categories from './category.route.js';

export default (app) => {
  const router = Router();

  app.use('/', router);

  auth(router);
  events(router);
  partners(router);
  categories(router);
};
