const convertCase = require('./helpers/convertCase');

const baseSerializer = (obj) => {
  if (!obj) return obj;
  const json = typeof obj.toObject === 'function' ? obj.toObject() : Object.assign({}, obj);
  delete json.__v;
  return json;
};

const serializeAccount = (account) => {
  if (!account) return account;
  const json = baseSerializer(account);
  delete json.hashedPassword;
  json.location = {
    latitude: json.location.coordinates[1],
    longitude: json.location.coordinates[0]
  };
  return convertCase.snakeCase(json);
};

const serializeUser = (user) => {
  if (!user) return user;
  const json = baseSerializer(user);
  delete json.hashedPassword;
  delete json.email;
  delete json.phoneNumber;
  json.location = {
    latitude: json.location.coordinates[1],
    longitude: json.location.coordinates[0]
  };
  return convertCase.snakeCase(json);
};

const serializeUsers = (users) => {
  return users.map(user => serializeUser(user));
};

const serializeBusiness = (business) => {
  if (!business) return business;
  const json = baseSerializer(business);
  json.location = {
    latitude: json.location.coordinates[1],
    longitude: json.location.coordinates[0]
  };
  return convertCase.snakeCase(json);
};

const serializeBusinesses = (businesses) => {
  return businesses.map(business => serializeBusiness(business));
};

const serializeReview = (review) => {
  if (!review) return review;
  const json = baseSerializer(review);
  json.user = serializeUser(review.user);
  json.business = serializeBusiness(review.business);
  return convertCase.snakeCase(json);
};

const serializeReviews = (reviews) => {
  return reviews.map(review => serializeReview(review));
};

module.exports = {
  serializeAccount: serializeAccount,
  serializeUser: serializeUser,
  serializeUsers: serializeUsers,
  serializeBusiness: serializeBusiness,
  serializeBusinesses: serializeBusinesses,
  serializeReview: serializeReview,
  serializeReviews: serializeReviews
};