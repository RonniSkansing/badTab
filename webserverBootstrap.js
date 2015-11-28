var repl = require('repl');
var path = require('path');
var config = require('./config.js');
var express = require('express');
var request  = require('request');
var app = express();

module.exports = function() {

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
  });
}
