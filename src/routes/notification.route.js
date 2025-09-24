import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import * as authMiddleware from '../middleware/auth.js';

export default (app) => {
  const router = Router();

  app.use('/notifications', router);

  router.get(
    '/',
    authMiddleware.isAuthenticate,
    notificationController.getNotifications,
  );

  router.patch(
    '/mark-all-read',
    authMiddleware.isAuthenticate,
    notificationController.markAllAsRead,
  );

  router.get(
    '/:id',
    authMiddleware.isAuthenticate,
    notificationController.getNotification,
  );

  router.patch(
    '/:id/status',
    authMiddleware.isAuthenticate,
    notificationController.updateNotificationStatus,
  );
};
