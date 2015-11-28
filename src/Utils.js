var config = require('../config.js');

module.exports = new function() {
  this.output = function(message) {
    if(config.verbose) {
      console.log(' >> '+message);
    }
  };
};
