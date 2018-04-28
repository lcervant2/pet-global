module.exports = function(scale, decay, offset) {
  // compute sigma^2 = -scale^2/2ln(decay)
  const sigma_2 = -Math.pow(scale, 2) / (2 * Math.log(decay || 0.5));
  return (value) => Math.exp(-Math.pow(Math.max(0, value - (offset || 0)), 2) / (2 * sigma_2));
};