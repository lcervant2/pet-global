const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  // load route files
  const authRoutes = require('./auth')(app);
  const usersRoutes = require('./users')(app);
  const businessesRoutes = require('./businesses')(app);
  const reviewsRoutes = require('./reviews')(app);
  const searchRoutes = require('./search')(app);
  const passwordRoutes = require('./password')(app);

  // set routes
  router.use('/', authRoutes);
  router.use('/users', usersRoutes);
  router.use('/businesses', businessesRoutes);
  router.use('/reviews', reviewsRoutes);
  router.use('/search', searchRoutes);
  router.use('/password', passwordRoutes);

  return router;
};