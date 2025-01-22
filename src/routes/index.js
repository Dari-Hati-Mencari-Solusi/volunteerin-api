import authRoute from './auth.route.js';

export default (app) => {
  app.use('/api/auth', authRoute);
};
