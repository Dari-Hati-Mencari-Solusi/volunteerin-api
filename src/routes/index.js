import { Router } from 'express';
import auth from './auth.route.js';
import events from './partner/event.route.js';
import partners from './partner/partnerProfile.route.js';
import categories from './category.route.js';
import responsiblePerson from './partner/responsiblePerson.route.js';
import legality from './partner/legality.route.js';
import eventBenefits from './eventBenefit.route.js';

export default (app) => {
  const router = Router();

  app.use('/', router);

  auth(router);
  events(router);
  partners(router);
  categories(router);
  responsiblePerson(router);
  legality(router);
  eventBenefits(router);
};
