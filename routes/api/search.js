const express = require('express');
const auth = require('../../middleware/auth');

module.exports = (app) => {
  // create a router
  const router = express.Router();

  // load the search controller
  const searchController = require('../../controllers/search');

  router
    .route('/')
    .get(auth.authenticate(app, { strict: false }), searchController.search);

  return router;
};