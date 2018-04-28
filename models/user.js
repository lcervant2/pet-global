const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const phonenumber = require('libphonenumber-js');

const OAuthToken = require('./oauth_token');
const Business = require('./business');
const Review = require('./review');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  hashedPassword: { type: String },
  email: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String },
  address: { type: Object },
  formattedAddress: { type: String },
  location: { type: Object },
  profilePicture: { type: String },
  bio: { type: String }
}, {
  timestamps: true
});

// index username
UserSchema.index({ username: 1 });
// index email
UserSchema.index({ email: 1 });
// create geo indexes
UserSchema.index({ location: '2dsphere' });

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
  });

// hash password before save
UserSchema.pre('save', async function() {
  const user = this;

  // format phone number
  if (this.phoneNumber)
    this.phoneNumber = phonenumber.formatNumber(phonenumber.parse(this.phoneNumber, 'US').phone, 'US', 'E.164');

  // only hash if the password has been changed
  if (user._password !== undefined) {
    // generate a salt
    const salt = await bcrypt.genSalt(10);
    // hash the password
    const hash = await bcrypt.hash(user._password, salt);
    // set the hashed password
    user.hashedPassword = hash;
  }
});

UserSchema.methods.comparePassword = async function(password) {
  if (this._password !== undefined) return this._password === password;

  return await bcrypt.compare(password, this.hashedPassword);
};

// clean up any models associated with this user when deleted
UserSchema.pre('remove', function(next) {
  // find and then delete so any hooks on these models are called as well
  OAuthToken
    .find({ userId: this._id })
    .then(tokens => tokens.forEach(token => token.remove()));
  Business
    .find({ user: this._id })
    .then(businesses => businesses.forEach(business => business.remove()));
  Review
    .find({ user: this._id })
    .then(reviews => reviews.forEach(review => review.remove()));
  next();
});

module.exports = mongoose.model('User', UserSchema);