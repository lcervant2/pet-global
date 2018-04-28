const googleMapsClient = require('../googleMaps');
const formatAddress = require('../helpers/formatAddress');

module.exports = function(obj) {
  if (obj.address) {
    const formattedAddress = formatAddress(obj.address);
    return googleMapsClient.geocode({
      address: formattedAddress
    })
      .asPromise()
      .then(response => {
        const results = response.json.results[0];
        const location = results['geometry']['location'];
        obj.location = {
          type: 'Point',
          coordinates: [
            location['lng'],
            location['lat']
          ]
        };
        obj.formattedAddress = formattedAddress;
        return obj;
      });
  } else
    return Promise.resolve(obj);
};