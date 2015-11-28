module.exports = function() {
  this.authenticate = function(username, password) {
    return username === password;
  }
};
