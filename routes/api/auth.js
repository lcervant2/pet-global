const express = require('express');
const auth = require('../../middleware/auth');

module.exports = (app) => {
  const router = express.Router()

  // get auth controller
  const authController = require('../../controllers/auth');

  router.get('/account', auth.authenticate(app), authController.find);
  router.put('/account', auth.authenticate(app), authController.update);
  router.delete('/account', auth.authenticate(app), authController.remove);
  router.post('/account/password', auth.authenticate(app), authController.updatePassword);
  router.post('/account/image', auth.authenticate(app), authController.uploadImage);
  router.delete('/account/image', auth.authenticate(app), authController.deleteImage);

  router.post('/register', authController.register);

  router.post('/oauth/token', app.oauth.token());

  return router;
};