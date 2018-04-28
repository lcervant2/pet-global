const mongoose = require('mongoose');

// setup mongoose promises
mongoose.Promise = global.Promise;

module.exports = () => {
  return mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost/petglobal')
    .catch(err => console.error(err));
};