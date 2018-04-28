module.exports = function(address) {
  var formatted = address.address1 + ', ';
  if (address.address2)
    formatted += address.address2 + ', ';
  formatted += address.city + ', ' + address.state + ' ' + address.zipCode;
  return formatted;
};