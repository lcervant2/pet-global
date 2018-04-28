const express = require('express');
const bodyParser = require('body-parser');
const OAuthServer = require('express-oauth-server');
const errors = require('./errors');
const HttpStatus = require('http-status-codes');

// load the database
require('./db')();

// import routes
const routes = require('./routes');

// create an express app
const app = express();

// setup OAuth
app.oauth = new OAuthServer({
  model: require('./models/oauth'),
  useErrorHandler: true
});

// setup body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve public files in development mode (image uploads)
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static('public'));
}

// serve static assets in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// add routes
app.use(routes(app));

// error handler for JSON Schema Validations
app.use((err, req, res, next) => {
  if (err.name === 'JsonSchemaValidationError') {
    res.status(HttpStatus.BAD_REQUEST);

    res.json({
      'json_schema_validation': true,
      'validations': err.validationErrors
    });
  } else {
    next(err);
  }
});

// error handler for custom APIErrors
app.use((err, req, res, next) => {
  if (err instanceof errors.APIError) {
    res.status(err.status);
    res.json({
      error: err
    });
  } else {
    next(err);
  }
});

// error handling - development
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      'message': err.message,
      'error': err.stack
    });
  });
}

// error handling - production
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    'message': err.message
  });
});

module.exports = app;