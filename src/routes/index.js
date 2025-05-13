import { Router } from 'express';
import auth from './auth.route.js';
import events from './event.route.js';
import partners from './partner/partnerProfile.route.js';
import categories from './category.route.js';
import responsiblePerson from './partner/responsiblePerson.route.js';
import legality from './partner/legality.route.js';
import forms from './form.route.js';
import partnerForms from './partner/form.route.js';
import benefits from './benefit.route.js';
import partnerEvents from './partner/event.route.js';
import adminUsers from './admin/user.route.js';
import partnerRegistrant from "./partner/registrant.route.js";

export default (app) => {
  const router = Router();

  app.use('/', router);

  // Volunteer Route
  auth(router);
  events(router);
  partners(router);
  categories(router);
  responsiblePerson(router);
  legality(router);
  forms(router);
  benefits(router);

  // Partner Route
  partnerEvents(router);
  partnerForms(router);
  partnerRegistrant(router);

  // Admin Route
  adminUsers(router);
};
