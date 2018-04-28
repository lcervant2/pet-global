const express = require('express');
const auth = require('../../middleware/auth');

module.exports = (app) => {
  // create a router
  const router = express.Router();

  // load the reviews controller
  const reviewsController = require('../../controllers/reviews');

  // setup routes
  router
    .route('/')
    .get(auth.authenticate(app, { strict: false }), reviewsController.findAll)
    .post(auth.authenticate(app), reviewsController.create);

  router
    .route('/:id')
    .get(auth.authenticate(app, { strict: false }), reviewsController.findById)
    .put(auth.authenticate(app), reviewsController.update)
    .delete(auth.authenticate(app), reviewsController.remove);

  return router;
};