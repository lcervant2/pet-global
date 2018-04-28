const mongoose = require('mongoose');

const OAuthTokenSchema = new mongoose.Schema({
  accessToken: { type: String, required: true, unique: true },
  accessTokenExpiresAt: { type: Date, required: true },
  client: { type: Object, required: true },
  clientId: { type: String, required: true },
  refreshToken: { type: String, required: true, unique: true },
  refreshTokenExpiresAt: { type: Date, required: true },
  user: { type: Object, required: true },
  userId: { type: String, required: true }
});

// index access token
OAuthTokenSchema.index({ accessToken: 1 });
// index refresh token
OAuthTokenSchema.index({ refreshToken: 1 });

module.exports = mongoose.model('OAuthToken', OAuthTokenSchema);