const models = require('../models');
const generateToken = require('../helpers/generateToken');

// load the database
require('../db')();

console.log('[...] Generating client...');

// generate random client id
const clientId = generateToken(32);

// generate random client secret
const clientSecret = generateToken(64);

// create a new client and save it to the database
models.OAuthClient
  .create({
    clientId: clientId,
    clientSecret: clientSecret,
    grants: ['password', 'refresh_token'],
    redirectUris: []
  })
  .then(() => {
    console.log('[+] Client created.');
    console.log('\nCLIENT_ID:\t' + clientId);
    console.log('CLIENT_SECRET:\t' + clientSecret);

    console.log('\nAdd these to these to the configuration file for the React.js client.\n');

    // exit
    process.exit();
  })
  .catch(err => console.error(err));