var config = require('../config.js');

module.exports = function(message) {
  if(config.verbose) {
    console.log(' >> '+message);
  }
};
