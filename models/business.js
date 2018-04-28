const mongoose = require('mongoose');
const phonenumber = require('libphonenumber-js');

const Review = require('./review');

const BusinessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  website: { type: String },
  address: { type: Object, required: true },
  formattedAddress: { type: String, required: true },
  location: { type: Object, required: true },
  serviceCategories: { type: Array, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: { type: Array, default: [], required: true }
}, {
  timestamps: true
});

// create text search indexes
BusinessSchema.index(
  {
    name: 'text',
    description: 'text',
    serviceCategories: 'text',
    formattedAddress: 'text'
  }, {
    weights: {
      name: 5,
      description: 3,
      serviceCategories: 5,
      formattedAddress: 1
    }
  });
// index serviceCategories
BusinessSchema.index({ serviceCategories: 1});
// create geo indexes
BusinessSchema.index({ location: '2dsphere' });

// format phone number
BusinessSchema.pre('save', function(next) {
  if (this.phoneNumber)
    this.phoneNumber = phonenumber.formatNumber(phonenumber.parse(this.phoneNumber, 'US').phone, 'US', 'E.164');
  next();
});

// clean up any models that are associated with this business
BusinessSchema.pre('remove', function(next) {
  // find and then delete so any hooks on these models is called as well
  Review
    .find({ business: this._id })
    .then(reviews => reviews.forEach(review => review.remove()));
  next();
});

module.exports = mongoose.model('Business', BusinessSchema);