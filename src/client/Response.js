module.exports = function(status, data) {
  this.getData = function() {
    return this.data;
  };

  this.getStatus = function() {
    return this.status;
  };
};
