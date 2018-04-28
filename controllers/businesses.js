const _ = require('lodash');
const path = require('path');
const HttpStatus = require('http-status-codes');
const { Validator } = require('express-json-validator-middleware');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const models = require('../models');
const serializers = require('../serializers');
const errors = require('../errors');
const convertCase = require('../helpers/convertCase');
const geocodeAddress = require('../helpers/geocodeAddress');

// cloudinary storage
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'business_images',
  allowedFormats: ['jpg', 'png']
});


// setup validator
const validator = new Validator({ allErrors: true, removeAdditional: true, useDefaults: true });
const validate = validator.validate;

// load business schema
const businessSchema = require('../schemas/business');

const findAll = async (req, res, next) => {
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

  try {
    // find all the businesses by the query and aggregate average review values
    let results = await models.Business.aggregate([
      { $match: _.isEmpty(query) ? { _id: { $ne: null } } : query },
      { $limit: 100 }, // TODO - pagination
      { $lookup: { from: 'reviews', localField: '_id', foreignField: 'business', as: 'reviews' } },
      { $unwind: { path: '$reviews', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$_id', averageRating: { $avg: '$reviews.overallRating' }, totalReviews: { $sum: 1 }, business: { $first: '$$ROOT' } } }
    ]);

    // merge the business key into the root object
    results = _.map(results, result => _.merge(result, result.business));

    // remove 'business' and 'reviews' keys
    results = _.map(results, result => _.omit(result, ['business', 'reviews']));

    // set default ratings stats if there are no reviews
    results = _.map(results, result => result.averageRating ? result :  _.merge(result, { averageRating: 0, totalReviews: 0 }));

    res.json(serializers.serializeBusinesses(results));
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  try {
    // find the business with the given id
    let business = await models.Business.findById(req.params.id).lean();

    // if no business is found return a not found error
    if (!business)
      return next(new errors.NotFoundError());

    // aggregate average reviews value
    const stats = await models.Review.aggregate([
      { $match: { business: business._id } },
      { $group: { _id: '$business', averageRating: { $avg: '$overallRating' }, totalReviews: { $sum: 1 } } }
    ]);

    if (stats.length) {
      // merge into business
      business = _.merge(business, stats[0]);
    } else {
      // no stats
      business.totalReviews = 0;
      business.averageRating = 0;
    }

    res.json(serializers.serializeBusiness(business))
  } catch (error) {
    next(error);
  }
};

const create = (req, res, next) => {
  // convert to camel case
  const business = convertCase.camelCase(req.body);
  // geocode the address
  geocodeAddress(business)
    .then(business => {
      // create in the database assigning user to the current user
      return models.Business
        .create(Object.assign({}, business, { user: req.user._id }))
        .then(business => res.json(serializers.serializeBusiness(business)));
    })
    .catch(err => next(err));
};

const update = (req, res, next) => {
  // convert to camel case
  const updates = convertCase.camelCase(req.body);

  // find the business in the database by id and current user
  models.Business
    .findOne({ _id: req.params.id, user: req.user._id })
    .then(business => {
      // if no business is found throw authorization error
      if (!business) throw new errors.AuthorizationError();

      // geocode the address
      return geocodeAddress(updates)
        .then(updates => {
          // update the business
          business.set(updates);
          return business.save();
        });
    })
    .then(business => res.json(serializers.serializeBusiness(business)))
    .catch(err => next(err));
};

const remove = (req, res, next) => {
  // find business (make sure to query by user as well) and remove
  models.Business
    .findOne({ _id: req.params.id, user: req.user._id })
    .then(business => {
      if (!business)
        throw new errors.AuthorizationError();
      return business.remove();
    })
    .then(() => res.status(HttpStatus.NO_CONTENT).end())
    .catch(err => next(err));
};

// image uploader
const uploader = multer(
  process.env.NODE_ENV === 'production'
    ? { storage: storage }
    : { dest: path.join(__dirname, '../public/uploads') }
);

const uploadImage = (req, res, next) => {
  uploader.single('image')(req, res, (err) => {
    if (err) {
      // handle unexpected file uploads
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(new errors.UnexpectedUploadError(err.field));
      }
    }

    // make sure the image was uploaded
    if (!req.file) {
      // if not return an upload error
      return next(new errors.MissingUploadError('image'));
    }

    // find the business by id and current user
    models.Business
      .findOne({ _id: req.params.id, user: req.user._id })
      .then(business => {
        // if the business cannot be found return an authorization error
        if (!business) return next(errors.AuthorizationError());
        // otherwise add a new image to the business
        if (process.env.NODE_ENV === 'production') {
          business.images.push({
            _id: req.file.public_id,
            url: req.file.secure_url
          });
        } else {
          business.images.push({
            _id: req.file.filename,
            url: '/uploads/' + req.file.filename
          });
        }
        return business
          .save()
          .then(business => res.json(serializers.serializeBusiness(business)));
      })
      .catch(err => next(err));
  });
};

const deleteImage = (req, res, next) => {
  // find the business by id and current user
  models.Business
    .findOne({ _id: req.params.id, user: req.user._id })
    .then(business => {
      // if the business cannot be found return an authorization error
      if (!business) return next(errors.AuthorizationError());
      // otherwise remove the image from the business' list of images
      const images = business.images;
      business.images = images.filter(image => image._id !== req.params.imageId);
      return business
        .save()
        .then(business => res.json(serializers.serializeBusiness(business)));
    })
    .catch(err => next(err));
};

module.exports = {
  findAll: findAll,
  findById: findById,
  create: [validate({ body: businessSchema }), create],
  update: [validate({ body: businessSchema }), update],
  remove: remove,
  uploadImage: uploadImage,
  deleteImage: deleteImage
}