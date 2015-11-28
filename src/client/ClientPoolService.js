var fs = require('fs');
var config = require('../../config.js');
var clientAuthService = require('./ClientAuthService.js');
var clientType = require('./ClientType.js');
var clientFactory = require('./ClientFactory');
var clientPool = require('./ClientPool.js');
var commands = require('./../Commands.js');
var responseFactory = require('./ResponseFactory.js');
var utils = require('./../Utils.js');
var wss = require('./../wss/WebSocketServerFactory.js');

module.exports = {
  currentSocketId: -1, // @replace with a unique hash
  getAll() {
    return clientPool.getAll();
  },
  addSlave(ip, origin, agent, wsSender) {
    var socketId = ++this.currentSocketId;
    var client = clientFactory(
      this.currentSocketId,
      clientType.slave,
      ip,
      origin,
      agent,
      wsSender
    );
    clientPool.add(client);
    utils.output('Slave socketId #'+socketId+' connected.');
    return socketId;
  },
  auth(socketId, user, pass) {
    var authResponse;
    console.log(clientAuthService);
    if(clientAuthService.authenticate(user,pass) === false) {
      authResponse = responseFactory('failure', {
          data: 'Wrong username or password'
      });
    } else {
      authResponse = responseFactory('success', {
          data: 'Rejuice!'
      });
      var client = clientPool.get(socketId);
      client.setNick(user);
      client.setType(clientType.master);
    }
    this.broadcast(
      client ? client : clientPool.get(socketId),
      authResponse
    );
  },
  broadcast(client, data) {
    if(typeof data !== 'string') {
      data = JSON.stringify(data);
    }
    client.getSender().send(data);
  },
  broadcastToSlaves(data) {
    clientPool.getAll().forEach( (client) => {
      this.sendToType(data, client, clientType.slave);
    });
  },
  broadcastToMasters(data) {
    clientPool.getAll().forEach( (client) => {
      this.sendToType(data, client, clientType.master);
    });
  },
  sendToType(data, client, type) {
    if(client.getType() === type) {
      this.broadcast(client, data);
    }
  },
  sendScript(client, file) {
    var that = this;
    fs.readFile('./payloads/'+file, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      that.broadcast(client, data);
    });
  },
  sendAllScript(file) {
    var that = this;
    fs.readFile('./payloads/'+file, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      that.broadcast(data);
    });
  },
  remove(socketId) {
    clientPool.remove(socketId);
    utils.output('Slave socketId #'+socketId+' Disconnected.');
  }
};
