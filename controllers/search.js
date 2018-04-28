const _ = require('lodash');
const mongoose = require('mongoose');
const { Validator } = require('express-json-validator-middleware');
const models = require('../models');
const serializers = require('../serializers');
const guassDecay = require('../helpers/guassDecay');
const convertCase = require('../helpers/convertCase');

const METERS_PER_MILE = 1609.34;

// setup guass decay function
const guass = guassDecay(10, 0.33, 2);

// setup validator
const validator = new Validator({ allErrors: true, removeAdditional: true, useDefaults: true });
const validate = validator.validate;

// load search schema
const searchSchema = require('../schemas/search');

const search = async (req, res, next) => {
  // since MongoDB does not allow text and location search at the same time we have to run two separate queries
  // and weight the results between the two manually

  try {

    // parse query
    let query = convertCase.camelCase(req.query);
    // convert useLocation to boolean
    query.useLocation = query.useLocation === 'true';
    // split up serviceCategories array
    if (query.serviceCategories) query.serviceCategories = query.serviceCategories.split(',');
    // set default location
    query.location = query.useLocation
      ? (query.location
        ? { type: 'Point', coordinates: [parseFloat(query.location.split(',')[1]), parseFloat(query.location.split(',')[0])] }
        : (req.user ? req.user.location : undefined))
      : undefined;
    // parse minimum rating requirement
    if (query.minimumRating) query.minimumRating = parseInt(query.minimumRating);

    // run the query/category search and filter by rating
    let results = await models.Business.aggregate([
      { $match: _.merge(
        query.serviceCategories ? { serviceCategories: { $all: query.serviceCategories } } : { _id: { $ne: null } },
        query.q ? { $text: { $search: query.q } } : {}) },
      { $addFields: { score: query.q ? { $meta: 'textScore' } : { $literal: 1 } } },
      { $lookup: { from: 'reviews', localField: '_id', foreignField: 'business', as: 'reviews' } },
      { $unwind: { path: '$reviews', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$_id', averageRating: { $avg: '$reviews.overallRating' }, totalReviews: { $sum: 1 }, business: { $first: '$$ROOT' } } },
      { $match: query.minimumRating ? { averageRating: { $gte: query.minimumRating } } : { _id: { $ne: null } } }
    ]);

    // merge the business key into the root object
    results = _.map(results, result => _.merge(result, result.business));

    // remove the 'business' and 'reviews' keys
    results = _.map(results, result => _.omit(result, ['business', 'reviews']));

    // set default ratings stats if there are no reviews
    results = _.map(results, result => result.averageRating ? result :  _.merge(result, { averageRating: 0, totalReviews: 0 }));

    // convert results to an object keyed by result ids
    results = _.keyBy(results, result => result._id);

    // run geo query if location is specified
    if (query.location) {
      let geoResults = await models.Business.aggregate([
        { $geoNear: { near: query.location, distanceField: 'distance', num: 1000, spherical: true, distanceMultiplier: 1/METERS_PER_MILE,
            query: { _id: { $in: _.map(results, result => result._id) } } } }
      ]);
      // key results by id
      geoResults = _.keyBy(geoResults, result => result._id);
      // merge into results
      results = _.merge(results, geoResults);
    }

    // convert results back to flat array
    results = Object.values(results);
    // convert results to scores
    let scores = _.map(results, result => result.score * (result.averageRating + 1) * guass(result.distance));
    // order results by score
    results = _.map(_.orderBy(_.zip(results, scores), '1', 'desc'), score => _.omit(score[0], 'score'));

    // serialize and return results
    res.json(serializers.serializeBusinesses(results));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  search: [validate({ query: searchSchema }), search]
}