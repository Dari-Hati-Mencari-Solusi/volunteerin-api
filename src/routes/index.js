import { Router } from 'express';
import auth from './auth.route.js';

export default (app) => {
  const router = Router();

  app.use('/api', router);

  auth(router);
};
