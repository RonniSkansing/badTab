var config = require('./../../config.js');
var clientPoolService = require('./../client/ClientPoolService.js');
var responseFactory = require('./../client/ResponseFactory.js');
var wss = require('./../wss/WebSocketServerFactory.js');

module.exports = function() {
  var clientSocketId;

  wss.on('connection', function(ws) {
    clientSocketId = clientPoolService.addSlave(
      ws.upgradeReq.connection.remoteAddress,
      ws.upgradeReq.headers.origin,
      ws.upgradeReq.headers['user-agent'],
      ws._sender
    );
    clientPoolService.broadcastToMasters(
      responseFactory('event', {
        type: 'connection',
        socketId: clientSocketId
      })
    );

    ws.on('close', function() {
      clientPoolService.remove(clientSocketId);
      clientPoolService.broadcastToMasters(
        responseFactory('event', {
          type: 'close',
          socketId: clientSocketId
        })
      );
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
          var autenticated = clientPoolService.identify(
            clientSocketId,
            entity.nick
          );
          if(authenticated) {
            clientPoolService.broadcastToMasters(
              responseFactory('event', {
                type: 'auth',
                socketId: clientSocketId,
                nick: entity.nick
              })
            );
          }
          break;
        case 'auth':
          clientPoolService.auth(
            clientSocketId,
            entity.nick,
            entity.pass
          );
          clientPoolService.broadcastToMasters(
            responseFactory('event', {
              type: 'auth',
              result: 'success',
              socketId: clientSocketId
            })
          );
        break;
      }
    });
  });
};
