var config = require('./../../config.js');
var clientService = require('./../client/ClientPoolService.js');
var wss = require('./../wss/WebSocketServerFactory.js');

module.exports = function() {
  var clientSocketId;

  wss.on('connection', (ws) => {
    clientSocketId = clientService.addSlave(
      ws.upgradeReq.connection.remoteAddress,
      ws.upgradeReq.headers.origin,
      ws.upgradeReq.headers['user-agent'],
      ws._sender
    );

    ws.on('close', function() {
      clientService.remove(clientSocketId);
    });

    ws.on('message', (data) => {
      try {
        var entity = JSON.parse(data);
      } catch (exception) {
        if(config.debug) {
          console.log('exception');
        }
        var entity = {
          type: null
        };
      }
      switch(entity.type) {
        case 'nick':
          clientService.identify(clientId, entity.nick);
          break;
        case 'auth':
          clientService.auth(
            clientId,
            entity.nick,
            entity.pass
          );
          break;
      }
    });
  });
};
