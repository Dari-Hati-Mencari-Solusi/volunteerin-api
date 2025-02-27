import { Router } from 'express';
import * as authMiddleware from '../middleware/auth.js';
import * as accessMiddleware from '../middleware/access.js';

export default (app) => {
  const router = Router();

  app.use('/partners', router);
};
