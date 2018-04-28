const express = require('express');
const path = require('path');
const errors = require('../errors');

module.exports = (app) => {
  // create a router
  const router = express.Router();

  // load route files
  const apiRoutes = require('./api')(app);

  // set routes
  router.use('/api', apiRoutes);

  // not found catchall for api
  router.use('/api/*', (req, res, next) => {
    next(new errors.NotFoundError());
  });

  // base route - server the react client
  router.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
  });

  return router;
};