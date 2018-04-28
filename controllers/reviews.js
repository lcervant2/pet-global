const HttpStatus = require('http-status-codes');
const { Validator } = require('express-json-validator-middleware');
const mongoose = require('mongoose');
const models = require('../models');
const serializers = require('../serializers');
const errors = require('../errors');
const convertCase = require('../helpers/convertCase');

// setup validator
const validator = new Validator({ allErrors: true, removeAdditional: true, useDefaults: true });
const validate = validator.validate;

// load review schema
const reviewSchema = require('../schemas/review');

// create modified review schema that requires the business_id
const reviewSchemaBusinessId = Object.assign({}, reviewSchema, { required: reviewSchema.required.concat('business_id') });

const findAll = (req, res, next) => {
  // convert the query params to camel case
  const query = convertCase.camelCase(req.query);
  // convert 'user' to object id
  if (query.user) {
    try {
      query.user = new mongoose.mongo.ObjectId(query.user);
    } catch (error) {
      // do nothing
    }
  }
  // convert 'business' to object id
  if (query.business) {
    try {
      query.business = new mongoose.mongo.ObjectId(query.business);
    } catch (error) {
      // do nothing
    }
  }

  // find reviews by query and order by created at date, populate user and business
  models.Review
    .find(query, null, { sort: '-createdAt' })
    .limit(20)
    .populate('user')
    .populate('business')
    .then(reviews => res.json(serializers.serializeReviews(reviews)))
    .catch(err => next(err));
};

const findById = (req, res, next) => {
  // find the review by id and popular user and business
  models.Review
    .findById(req.params.id)
    .populate('user')
    .populate('business')
    .then(review => res.json(serializers.serializeReview(review)))
    .catch(err => next(err));
};

const create = async (req, res, next) => {
  // convert to camel case
  const reviewParams = convertCase.camelCase(req.body);

  // grab the businessId and remove from the review params
  const businessId = reviewParams.businessId;
  delete reviewParams.businessId;

  try {
    // find the business to add the review to
    const business = await models.Business.findById(businessId);

    // if no business found return not found error
    if (!business) return next(new errors.NotFoundError());

    let review = await models.Review.create(Object.assign({}, reviewParams, { user: req.user._id, business: business._id }));
    review = await review.populate(['user', 'business']).execPopulate();
    res.json(serializers.serializeReview(review));
  } catch (error) {
    next(error);
  }
};

const update = (req, res, next) => {
  // convert to camel case
  const updates = convertCase.camelCase(req.body);

  // find the model by id and current user - populate user and business
  models.Review
    .findOne({ _id: req.params.id, user: req.user._id })
    .populate('user')
    .populate('business')
    .then(review => {
      // if no review is found for this user return an authorization error
      if (!review) throw new errors.AuthorizationError();
      // otherwise update the review
      review.set(updates);
      return review
        .save()
        .then(review => res.json(serializers.serializeReview(review)));
    })
    .catch(err => next(err));
};

const remove = (req, res, next) => {
  // find the review by id and current user and remove it from the database
  models.Review
    .findOne({ _id: req.params.id, user: req.user._id })
    .then(review => {
      // if not review is found return an authorization error
      if (!review) throw new errors.AuthorizationError();
      // otherwise remove the review
      return review.remove();
    })
    // send back a no content response
    .then(() => res.status(HttpStatus.NO_CONTENT).end())
    .catch(err => next(err));
}

module.exports = {
  findAll: findAll,
  findById: findById,
  create: [validate({ body: reviewSchemaBusinessId }), create],
  update: [validate({ body: reviewSchema }), update],
  remove: remove
};

