module.exports = function(status, data) {
  this.getData = function() {
    return data;
  };

  this.getStatus = function() {
    return status;
  };
};
