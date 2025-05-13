import { Router } from 'express';
import * as authMiddleware from '../../middleware/auth.js';
import * as accessMiddleware from '../../middleware/access.js';
import * as registrantController from "../../controllers/partner/registrant.controller.js";
import * as registrantValidation from "../../middleware/validations/registrant.js";

export default (app) => {
  const router = Router();

  app.use('/partners/me', router);

  router.get(
    "/events/:eventId/registrants",
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    registrantController.showRegistrantsList
  );

  router.get(
    "/events/:eventId/registrants/:registrantId",
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    registrantController.showDetailRegistrant
  );

  router.post(
    "/events/:eventId/registrants/:registrantId",
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    registrantValidation.validateReviewRegistrant,
    registrantController.reviewRegistrant
  );
}