const _ = require('lodash');
const HttpStatus = require('http-status-codes');
const { Validator } = require('express-json-validator-middleware');
const path = require('path');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const models = require('../models');
const errors = require('../errors');
const serializers = require('../serializers');
const convertCase = require('../helpers/convertCase');
const geocodeAddress = require('../helpers/geocodeAddress');

// cloudinary storage
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'profile_pictures',
  allowedFormats: ['jpg', 'png']
});

// setup validator
const validator = new Validator({ allErrors: true, removeAdditional: true, useDefaults: true });
const validate = validator.validate;

// load user schema
const userSchema = require('../schemas/user');

// create modified user schema that requires password
const userSchemaPassword = Object.assign({}, userSchema, { required: userSchema.required.concat('password') });

const find = async (req, res, next) => {
  // return the current user
  // find the user by username
  try {
    let user = req.user.toObject();

    // aggregate average reviews value
    const stats = await models.Review.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: '$user', averageRating: { $avg: '$overallRating' }, totalReviews: { $sum: 1 } } }
    ]);

    if (stats.length) {
      // merge into user
      user = _.merge(user, stats[0]);
    } else {
      // no stats
      user.totalReviews = 0;
      user.averageRating = 0;
    }

    res.json(serializers.serializeAccount(user));
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  // get the user and convert to camel case
  let userParams = convertCase.camelCase(req.body);

  try {
    // check to make sure username and email are not taken by another user
    let user = await models.User.findOne({
        $or: [
          { username: userParams.username },
          { email: userParams.email }
        ]
      });

    if (user) {
      // user was found - return error
      if (user.username === userParams.username) {
        // username is taken
        next(new errors.UsernameUnavailableError());
      } else {
        // email is taken
        next(new errors.EmailAlreadyRegisteredError());
      }
    } else {
      // geocode the address if there is an address field
      if (userParams.address)
        userParams = await geocodeAddress(userParams);
      user = await models.User.create(userParams);
      res.json(serializers.serializeAccount(user));
    }
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  // get the updates and convert to camel case
  let updates = convertCase.camelCase(req.body);

  // do not allow updates to password
  delete updates.password;

  // check to make sure username and email are associated with the current user already
  // or are not taken by another user

  try {
    // try to find a user with the same username or email that is NOT the current user
    let user = await models.User.findOne({
        $or: [
          { username: updates.username },
          { email: updates.email }
        ],
        _id: { $ne: req.user._id }
      });

    if (user) {
      // user was found - return error
      if (user.username === updates.username) {
        // username is taken
        next(new errors.UsernameUnavailableError());
      } else {
        // email is taken
        next(new errors.EmailAlreadyRegisteredError());
      }
    } else {
      // if the updates contain an address geocode it
      if (updates.address)
        updates = await geocodeAddress(updates);
      // update the current user with the updates
      req.user.set(updates);
      user = await req.user.save();
      res.json(serializers.serializeAccount(user));
    }
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    // convert body to camel case
    let body = convertCase.camelCase(req.body);

    const newPassword = body.newPassword;
    const oldPassword = body.oldPassword;

    // if no old password return unauthorized
    if (!oldPassword)
      return next(new errors.AuthorizationError());

    // check that passwords match
    const check = await req.user.comparePassword(oldPassword);
    if (!check)
      return next(new errors.AuthorizationError());

    // update password and save
    req.user.password = newPassword;
    const user = await req.user.save();
    res.json(serializers.serializeAccount(user));
  } catch (error) {
    next(error);
  }
};

const remove = (req, res, next) => {
  // remove the current user from the database
  req.user
    .remove()
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

    // update the current user's profile picture url
    if (process.env.NODE_ENV === 'production')
      req.user.profilePicture = req.file.secure_url;
    else
      req.user.profilePicture = '/uploads/' + req.file.filename;
    return req.user
      .save()
      .then(user => res.json(serializers.serializeAccount(user)))
      .catch(err => next(err));
  });
};

const deleteImage = (req, res, next) => {
  // update the current user's profile picture url to null
  req.user.profilePicture = null;
  return req.user
    .save()
    .then(user => res.json(serializers.serializeAccount(user)))
    .catch(err => next(err));
};

module.exports = {
  find: find,
  update: [validate({ body: userSchema }), update],
  register: [validate({ body: userSchemaPassword }), register],
  remove: remove,
  uploadImage: uploadImage,
  deleteImage: deleteImage,
  updatePassword: updatePassword
};