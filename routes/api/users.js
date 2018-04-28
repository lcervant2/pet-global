const express = require('express');
const auth = require('../../middleware/auth');

module.exports = (app) => {
  const router = express.Router();

  // load users controller
  const usersController = require('../../controllers/users');

  router
    .route('/:username')
    .get(auth.authenticate(app), usersController.findByUsername);

  return router;
};