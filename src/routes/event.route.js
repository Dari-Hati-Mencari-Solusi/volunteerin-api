import { Router } from 'express';
import * as eventController from '../controllers/event.controller.js';
import * as authMiddleware from '../middleware/auth.js';
import * as eventMiddleware from '../middleware/event.js';
import * as eventValidation from '../middleware/validations/event.js';
import * as accessMiddleware from '../middleware/access.js';
import { Roles } from '../constants/roles.js';

export default (app) => {
  const router = Router();

  app.use('/events', router);

  router.get('/', eventController.getAllEvents);

  router.get(
    '/histories',
    authMiddleware.isAuthenticate,
    accessMiddleware.authorize([Roles.VOLUNTEER]),
    eventController.getUserEventHistory,
  );

  router.get(
    '/:id',
    eventMiddleware.ensureEventIsReleased,
    eventController.getEvent,
  );

  router.get(
    '/:id/register',
    authMiddleware.isAuthenticate,
    accessMiddleware.authorize([Roles.VOLUNTEER]),
    eventMiddleware.ensureEventIsReleased,
    eventController.showRegistrationForm,
  );

  router.post(
    '/:id/register',
    authMiddleware.isAuthenticate,
    accessMiddleware.authorize([Roles.VOLUNTEER]),
    eventMiddleware.ensureEventIsReleased,
    eventValidation.validateSubmitRegistration,
    eventController.submitRegistration,
  );
};
