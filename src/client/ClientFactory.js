var client = require('./Client.js');
var clientDetails = require('./ClientDetails.js');
module.exports = function(socketId, type, ip, origin, agent, sender) {
  return new client(
    socketId,
    null, // nick
    type,
    new clientDetails(
      ip, origin, agent
    ),
    sender
  );
}
