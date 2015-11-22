var WebSocketServer = require('ws').Server;
var config = require('../config.js');

module.exports = new WebSocketServer({
  port: config.wss.port
});
