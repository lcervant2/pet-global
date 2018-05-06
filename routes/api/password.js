const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  // get password controller
  const passwordController = require('../../controllers/password');

  router.post('/reset', passwordController.resetPassword);
  router.post('/reset/confirm', passwordController.createPassword);

  return router;
};