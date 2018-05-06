const mongoose = require('mongoose');

const PasswordResetTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

PasswordResetTokenSchema.index({ token: 1, user: 1 });

module.exports = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);