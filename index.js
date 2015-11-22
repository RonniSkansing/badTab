var repl = require('repl');
var path = require('path');
var commands = require('./src/Commands.js');
var config = require('./config.js');
var clients = require('./src/Client/Clients.js');
var output = require('./src/Utils.js');
var wss = require('./src/WebSocketServerFactory.js');
var repl = require('./src/Repl.js');
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/slave.html'));
});
app.get('/js', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/slave.js'));
});


var server = app.listen(8090, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('slave html/js listening at http://%s:%s', host, port);
});

wss.on('connection', (ws) => {
  var clientId = clients.add(ws._sender);
  output('Slave #'+clientId+' connected.');

  ws.on('close', () => {
    clients.remove(this.Id);
    output('Slave #'+clientId+' Disconnected.');
  });

  ws.on('message', (data) => {
    var entity = JSON.parse(data);
    switch(entity.type) {
      case 'nick':
        clients.identify(clientId, entity.nick);
        break;
      case 'auth':
        clients.auth(
          clientId,
          entity.nick,
          entity.pass
        )
    }
  });
});

if(config.repl) {
  repl.start();
}