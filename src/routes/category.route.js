import { Router } from 'express';
import * as authMiddleware from '../middleware/auth.js';
import * as categoryController from '../controllers/category.controller.js';
import * as accessMiddleware from '../middleware/access.js';
import * as categoryValidation from '../middleware/validations/category.js';
import { Roles } from '../constants/roles.js';

export default (app) => {
  const router = Router();

  app.use('/categories', router);

  // Admin only routes
  router.post(
    '/',
    authMiddleware.isAuthenticate,
    accessMiddleware.authorize([Roles.ADMIN]),
    categoryValidation.validateCategoryCreate,
    categoryController.createCategory,
  );

  router.put(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.authorize([Roles.ADMIN]),
    categoryValidation.validateCategoryUpdate,
    categoryController.updateCategory,
  );

  router.delete(
    '/:id',
    authMiddleware.isAuthenticate,
    accessMiddleware.authorize([Roles.ADMIN]),
    categoryController.deleteCategory,
  );

  // Public routes
  router.get('/', categoryController.getAllCategories);
  router.get('/:id', categoryController.getCategoryById);
};
