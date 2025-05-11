import { Router } from 'express';
import * as formController from '../controllers/partner/form.controller.js';
export default (app) => {
  const router = Router();

  app.use('/forms', router);

  // Public routes - semua user dapat melihat form
  router.get('/', formController.getForms);
};
