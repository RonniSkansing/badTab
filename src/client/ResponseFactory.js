var response = require('./Response.js');

module.exports = function(status, data) {
  return new response(
      status, data
  );
};
