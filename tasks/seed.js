const _ = require('lodash');
const axios = require('axios');
const models = require('../models/index');
const geocodeAddress = require('../helpers/geocodeAddress');


// CONSTANTS

// yelp api key
const YELP_API_KEY = 'QBvpuJQqlUfFJd3U5niTiUvzjGK8LO7DbJfl4N8lMCiDjfg5C2lEI6bK3ACXeND-oULhKNQVQzsvGi15loyzG2_joOF7_5YyYrpz3MZuTP8_oDYSzbzeGjMrnofbWnYx';
// yelp category to search
const YELP_CATEGORY = 'pets';
// page size for requests
const PAGE_SIZE = 50;
// convert yelp categories into PetGlobal categories
const CATEGORY_MAP = {
  'animalphysicaltherapy': 'veterinary',
  'emergencypethospital': 'emergency',
  'farrier': 'grooming',
  'animalholistic': 'veterinary',
  'petbreeders': 'retail',
  'pethospice': 'veterinary',
  'petinsurance': 'insurance',
  'pet_sitting': 'caretaker',
  'petboarding': 'caretaker',
  'pet_training': 'training',
  'pettransport': 'relocation',
  'petstore': 'retail',
  'birdshops': 'retail',
  'localfishstores': 'retail',
  'reptileshops': 'retail',
  'vet': 'veterinary',
  'grooming': 'grooming'
};
// locations to search
const LOCATIONS = [
  'Washington, D.C.',
  'Arlington County, VA',
  'Fairfax County, VA',
  'Loudoun County, VA',
  'Prince William County, VA',
  'Alexandria, VA',
  'Fairfax, VA',
  'Manassas, VA',
  'Falls Church, VA'
];


function parseBusiness(data) {
  return {
    id: data['id'],
    name: data['name'],
    description: data['name'],
    address: {
      address1: data['location']['address1'],
      address2: data['location']['address2'],
      city: data['location']['city'],
      state: data['location']['state'],
      zipCode: data['location']['zip_code']
    },
    phoneNumber: data['phone'],
    formattedAddress: data['location']['display_address'].join(', '),
    location: {
      type: 'Point',
      coordinates: [
        data['coordinates']['longitude'],
        data['coordinates']['latitude']
      ]
    },
    serviceCategories: _.uniq(data['categories']
        .map(category => category['alias'])
        .filter(category => CATEGORY_MAP.hasOwnProperty(category))
        .map(category => CATEGORY_MAP[category])),
    images: [
      {
        _id: data['id'],
        url: data['image_url']
      }
    ]
  };
}

async function searchLocation(location, categories, pageSize) {
  // get output stream
  const stream = process.stdout;

  // page offset
  var offset = 0;
  // total businesses to load
  var total = 1;
  // list of businesses stored id => business
  const businesses = {};

  while (offset < total) {
    // load the next page of results
    const response = await axios({
      method: 'get',
      url: 'https://api.yelp.com/v3/businesses/search',
      headers: {
        'Authorization': 'Bearer ' + YELP_API_KEY
      },
      params: {
        categories: categories,
        limit: pageSize,
        location: location,
        offset: offset
      }
    });

    // if this is the first load set total to the correct value
    if (offset === 0) {
      // yelp limit is 1000 total
      total = Math.min(response.data['total'], 1000);
      // log total
      console.log('[+] Found ' + total + ' businesses...');
    }

    // get the list of businesses from the response
    const page = response.data['businesses'];

    // loop through the page
    for (var i = 0; i < page.length; i++) {
      // parse the business data
      const business = parseBusiness(page[i]);

      // check to make sure the business has at least one valid category then add to the list
      if (business.serviceCategories.length > 0
        && business.address.address1 && business.address.city && business.address.state && business.address.zipCode)
        businesses[business.id] = business;
    }

    // increase page offset
    offset = Math.min(offset + pageSize, total);

    // print out progress
    stream.clearLine();
    stream.cursorTo(0);
    stream.write('  [...] ' + Math.floor(offset * 100 / total) + '%\t(' + offset + '/' + total + ')');
  }

  // print out new line
  stream.write('\n');

  // return the list
  return businesses;
}

// run main code inside async block to use await/async syntax
const run = async () => {
  try {
    // connect to MongoDB database
    await require('../db')();
    console.log('[+] Connected to the database');

    // clear the database of all businesses and reviews
    console.log('\n[-] Clearing businesses and reviews...');
    models.Business.remove({}).exec();
    models.Review.remove({}).exec();
    console.log('[+] Done');

    // create a bot user
    console.log('\n[-] Creating bot user...');
    await models.User.remove({ username: 'businessbot' });
    let user = await geocodeAddress({
      username: 'businessbot',
      password: 'businessbot',
      email: 'businessbot@none.com',
      firstName: 'Business',
      lastName: 'Bot',
      bio: 'I am a business bot!',
      address: {
        address1: '3955 Chain Bride Rd',
        address2: null,
        city: 'Fairfax',
        state: 'VA',
        zipCode: '22030'
      }
    });
    user = await models.User.create(user);
    console.log('[+] Done');

    // create empty object to hold the parsed businesses
    var businesses = {};

    // loop through locations
    for (var i = 0; i < LOCATIONS.length; i++) {
      console.log('\n[-] Searching ' + LOCATIONS[i] + '...');
      // search the location
      const results = await searchLocation(LOCATIONS[i], YELP_CATEGORY, PAGE_SIZE);
      // add the results to the business list
      businesses = Object.assign({}, businesses, results);
    }

    // convert the list to a flat array and set the user
    businesses = _.map(Object.values(businesses), business => Object.assign({}, business, { user: user._id }));

    // remove the id field from each of the businesses
    businesses.forEach(business => {
      delete business.id;
    });

    // log total business count
    console.log('\n[+] Total: ' + businesses.length + ' businesses');

    // insert the businesses into the database
    console.log('\n[-] Writing to database...');
    await models.Business.collection.insert(businesses);
    console.log('[+] Done!');
  } catch (error) {
    if (error.response)
      console.log(error.response.data.error);
    else
      console.error(error);
  }

  // exit
  process.exit();
};
run();
