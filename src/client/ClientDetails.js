module.exports = function(ip, origin, agent) {
  this.getOrigin = function() {
    return origin;
  };

  this.getAgent = function() {
    return agent;
  };

  this.getIp = function() {
    return ip;
  };
}
