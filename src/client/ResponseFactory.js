var response = require('./response.js');

module.exports = function(status, data) {
  return new response(
      status, data
  );
};
