const models = require('../models/index');
const mongoose = require('mongoose');
const geocodeAddress = require('../helpers/geocodeAddress');

// load db
require('../db')();

const run = async function() {
  try {
    // remove all models
    await models.Review.remove({});

    // delete the bot user if there is one
    await models.User.remove({ username: 'reviewbot' });

    // create a bot user
    let user = await geocodeAddress({
      username: 'reviewbot',
      password: 'reviewbot',
      email: 'reviewbot@none.com',
      firstName: 'Review',
      lastName: 'Bot',
      bio: 'I am a review bot!',
      address: {
        address1: '3955 Chain Bride Rd',
        address2: null,
        city: 'Fairfax',
        state: 'VA',
        zipCode: '22030'
      }
    });
    user = await models.User.create(user);

    // load all the businesses
    const businesses = await models.Business.find({});
    const reviews = [];

    for (let i = 0; i < 1000; i++) {
      const business = businesses[Math.floor(Math.random() * businesses.length)];

      const numReviews = Math.floor(Math.random() * 50);
      for (let j = 0; j < numReviews; j++) {
        // create a random review
        reviews.push({
          business: business._id,
          overallRating: Math.ceil(Math.random() * 5),
          customerServiceRating: Math.ceil(Math.random() * 5),
          priceRating: Math.ceil(Math.random() * 5),
          qualityRating: Math.ceil(Math.random() * 5),
          description: 'This is a bot generated rating for ' + business.name + '. What a great company!',
          transactionOccured: Math.random() >= 0.5,
          repeatCustomer: Math.random() >= 0.5,
          date: Date.now(),
          serviceCategories: business.serviceCategories,
          user: user._id
        });
      }
    }

    await models.Review.collection.insert(reviews);
  } catch (error) {
    console.error(error);
  }

  process.exit();
};

run();