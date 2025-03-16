// routes/event.route.js
import { Router } from 'express';
import * as authMiddleware from '../middleware/auth.js';
import * as eventController from '../controllers/event.controller.js';
import * as accessMiddleware from '../middleware/access.js';
import * as eventValidation from '../middleware/validations/event.js';
import uploadMiddleware from '../utils/multer.js';

export default (app) => {
  const router = Router();

  app.use('/api/v1', router);

  // Public endpoints
  router.get('/events', eventController.getAllEvents);
  router.get('/events/:id', eventController.getEventById);

  // Partner events management - Resource Oriented
  router.get(
    '/partners/:partnerId/events',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    eventController.getPartnerEvents,
  );

  router.post(
    '/partners/:partnerId/events',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    accessMiddleware.isOwnerOrAdmin('partnerId'),
    accessMiddleware.checkPartnerStatus(['ACCEPTED', 'VERIFIED']),
    accessMiddleware.checkEventQuota,
    uploadMiddleware,
    eventValidation.validateEventCreate,
    eventController.createPartnerEvent,
  );

  router.get(
    '/partners/:partnerId/events/:eventId',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    eventController.getPartnerEventDetail,
  );

  router.patch(
    '/partners/:partnerId/events/:eventId',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    accessMiddleware.checkPartnerStatus(['ACCEPTED', 'VERIFIED']),
    uploadMiddleware,
    eventValidation.validateEventUpdate,
    eventController.updatePartnerEvent,
  );

  router.delete(
    '/partners/:partnerId/events/:eventId',
    authMiddleware.isAuthenticate,
    accessMiddleware.isPartner,
    eventController.deletePartnerEvent,
  );

  // Admin endpoints - untuk akses admin ke semua event
  router.get(
    '/admin/events',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdmin,
    eventController.getAllEventsAdmin,
  );

  router.patch(
    '/admin/events/:eventId',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdmin,
    uploadMiddleware,
    eventValidation.validateEventUpdate,
    eventController.adminUpdateEvent,
  );

  router.delete(
    '/admin/events/:eventId',
    authMiddleware.isAuthenticate,
    accessMiddleware.isAdmin,
    eventController.adminDeleteEvent,
  );
};
