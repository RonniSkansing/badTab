module.exports = function(id, nick, type, details, sender) {

  this.getId = function() {
    return id;
  };

  this.getNick = function() {
    return nick;
  };

  this.setNick = function(clientNick) {
    nick = clientNick;
  };

  this.setType = function(clientType) {
    type = clientType;
  }

  this.getType = function() {
    return type;
  };

  this.setDetails = function(clientDetails) {
    details = clientDetails;
  };

  this.getDetails = function() {
    return details;
  };

  this.getSender = function() {
    return sender;
  }
};
