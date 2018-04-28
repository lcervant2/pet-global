const models = require('../models');
const errors = require('../errors');

// custom middleware that extends the express-oauth2-server authenticate middleware
// by setting req.user
module.exports.authenticate = (app, options={}) => {
  options = Object.assign({}, {
    strict: true
  }, options);

  return [
    app.oauth.authenticate(),
    (err, req, res, next) => {
      // catch an unauthorized error
      if (err.name === 'unauthorized_request' && !options.strict) {
        next();
      } else {
        next(new errors.AuthorizationError());
      }
    },
    (req, res, next) => {
      // pull the user from the database
      if (res.locals.oauth) {
        const userId = res.locals.oauth.token.userId;
        models.User.findOne({ _id: userId })
          .then(user => {
            req.user = user;
            next();
          })
          .catch(err => next(err));
      } else {
        next();
      }
    }
  ];
};