const _ = require('lodash');
const models = require('../models');
const serializers = require('../serializers');
const errors = require('../errors');

const findByUsername = async (req, res, next) => {
  // find the user by username
  try {
    let user = await models.User.findOne({ username: req.params.username }).lean();

    // if no user is found return a not found error
    if (!user)
      return next(new errors.NotFoundError());

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

    res.json(serializers.serializeUser(user));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findByUsername: findByUsername
};