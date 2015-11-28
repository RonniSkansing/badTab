module.exports = new function() {
  this.authenticate = function(username, password) {
    return username === password;
  }
};
