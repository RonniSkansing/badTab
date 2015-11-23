var WebSocketServer = require('ws').Server;
var config = require('../config.js');

module.exports = new WebSocketServer({
  //host: .. , 
  port: config.wss.port
});
