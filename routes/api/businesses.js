const express = require('express');
const auth = require('../../middleware/auth');

module.exports = (app) => {
  // create router
  const router = express.Router();

  // load businesses controller
  const businessesController = require('../../controllers/businesses');

  router
    .route('/')
    .get(auth.authenticate(app), businessesController.findAll)
    .post(auth.authenticate(app), businessesController.create);

  router
    .route('/:id')
    .get(auth.authenticate(app, { strict: false }), businessesController.findById)
    .put(auth.authenticate(app), businessesController.update)
    .delete(auth.authenticate(app), businessesController.remove);

  router.post('/:id/images', auth.authenticate(app), businessesController.uploadImage);
  router.delete('/:id/images/:imageId', auth.authenticate(app), businessesController.deleteImage);

  return router;
};