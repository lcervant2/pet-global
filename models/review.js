const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
  overallRating: { type: Number, required: true },
  priceRating: { type: Number, required: true },
  customerServiceRating: { type: Number, required: true },
  qualityRating: { type: Number, required: true },
  description: { type: String, required: true },
  repeatCustomer: { type: Boolean, required: true },
  transactionOccurred: { type: Boolean, required: true },
  date: { type: Date, required: true },
  serviceCategories: { type: Array, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true }
}, {
  timestamps: true
});

// index business and overallRating
ReviewSchema.index({ business: 1, createdAt: -1, overallRating: -1 });
// index business and date
ReviewSchema.index({ business: 1, createdAt: -1, date: -1 });
// index user and createdAt
ReviewSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('Review', ReviewSchema);