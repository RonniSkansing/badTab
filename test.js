module.exports = function(agent) {
//  var origin = origin;
//  var ip = ip;
//  var agent = agent;
  this.getOrigin = function() {
    return origin;
  };

  this.getIp = function() {
    return ip;
  };

  this.getAgent = function() {
    return agent;
  }
};
