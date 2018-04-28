const OAuthToken = require('./oauth_token');
const OAuthClient = require('./oauth_client');
const User = require('./user');

// get access token
module.exports.getAccessToken = (bearerToken) => {
  // find the token in the database and return
  return OAuthToken.findOne({ accessToken: bearerToken }).lean();
};

// get client
module.exports.getClient = (clientId, clientSecret) => {
  // find the client in the database and return
  return OAuthClient.findOne({ clientId: clientId, clientSecret: clientSecret }).lean();
};

// get refresh token
module.exports.getRefreshToken = (refreshToken) => {
  // find the token in the database and return
  return OAuthToken.findOne({ refreshToken: refreshToken }).lean();
};

// revoke a token
module.exports.revokeToken = (token) => {
  // find the token and delete it
  return OAuthToken.remove({ refreshToken: token.refreshToken }).then(() => true);
}

// get user
module.exports.getUser = (username, password) => {
  // find the user in the database by username or email, check the password and return
  return User
    .findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    })
    .then(user => {
      return user.comparePassword(password)
        .then(isMatch => {
          if (isMatch)
            return user.toJSON();
          else
            return null;
        });
    });
}

// save token
module.exports.saveToken = (token, client, user) => {
  // create the new token
  const accessToken = new OAuthToken({
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    client: client,
    clientId: client.clientId,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    user: user,
    userId: user._id
  });
  // save the token (wrap in a Promise to avoid mongoose Promise wrapper)
  return new Promise((resolve, reject) => {
    accessToken.save((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  }).then(saveResult => {
    // saveResult is a mongoose result - convert it to JSON
    saveResult = saveResult && typeof saveResult === 'object' ? saveResult.toJSON() : saveResult;

    // make a copy of saveResult to avoid returning any pointers used by the oauth library
    var data = new Object();
    for (var prop in saveResult)
      data[prop] = saveResult[prop];

    // override client and user values
    data.client = data.clientId;
    data.user = data.userId;

    return data;
  });
}