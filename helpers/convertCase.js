const changeCase = require('change-case');

const camelCase = (obj) => {
  // check if this object is an array
  if (obj !== null && typeof obj === 'object' && obj.constructor === Array)
    return obj.map(item => camelCase(item));
  // check if this object is not a 'plain' object
  if (obj === null || typeof obj !== 'object' || obj.constructor !== Object) return obj;
  // create empty object for converted properties
  const convertedObj = {};
  // loop through properties of object
  for (const prop in obj) {
    // convert the property name to camel case
    const camelCaseProp = changeCase.camelCase(prop);
    // set the value to the converted object using the new property name
    // recursively convert the object
    convertedObj[camelCaseProp] = camelCase(obj[prop]);
  }
  return convertedObj;
};

const snakeCase = (obj) => {
  // check if this object is an array
  if (obj !== null && typeof obj === 'object' && obj.constructor === Array)
    return obj.map(item => snakeCase(item));
  // check if this object is not a 'plain' object
  if (obj === null || typeof obj !== 'object' || obj.constructor !== Object) return obj;
  // create empty object for converted properties
  const convertedObj = {};
  // loop through properties of object
  for (const prop in obj) {
    // convert the property name to snake case
    const snakeCaseProp = changeCase.snakeCase(prop);
    // set the value to the converted object using the new property name
    // recursively convert the object
    convertedObj[snakeCaseProp] = snakeCase(obj[prop]);
  }
  return convertedObj;
};

module.exports = {
  camelCase: camelCase,
  snakeCase: snakeCase
};