const mongoose = require('mongoose');

const OAuthClientSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
    unique: true
  },
  clientSecret: {
    type: String,
    required: true
  },
  redirectUris: {
    type: Array,
    required: true
  },
  grants: {
    type: Array,
    required: true
  }
});

// index clientId and clientSecret
OAuthClientSchema.index({ clientId: 1, clientSecret: 1 });

module.exports = mongoose.model('OAuthClient', OAuthClientSchema);