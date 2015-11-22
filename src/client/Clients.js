var fs = require('fs');
var config = require('../../config.js');
var clientFactory = require('./ClientFactory.js');
var clientType = require('./ClientType.js');
var clientPool = require('./ClientPool.js');
var commands = require('./../Commands.js');
var wss = require('./../WebSocketServerFactory.js');

// @todo replace mock
function auth(user, pass) {
  return (user === 'admin' && pass === 'admin');
}

module.exports = {
  add(client, nick) {
    return clientPool.add(client, nick);
  },
  auth(id, user, pass) {
    if(auth(user,pass) === false) {
      this.sendAsJson(
        id,
        {
          data: null,
          success: false
        }
      );
      return;
    }
    var client = clientPool.get(id);
    client.nick = user;
    client.type = clientType.master;
    client.authenticated = true;
    this.sendAsJson(
      id,
      {
        data: null,
        success: true
      }
    );
  },
  broadcast(message, type) {
    clientPool.pool.forEach( (client) => {
      if(client.type === clientType.slave) {
        client.sender.send(message);
      }
    });
  },
  broadcastToMasters(message) {
    clientPool.pool.forEach( (client) => {
      if(client.type === clientType.master) {
        client.sender.send(message);
      }
    });
  },
  send(id, message) {
    var client = clientPool.get(id);
    if(client.type === clientType.slave) {
      client.sender.send(message);
    }
  },
  sendAsJson(id, data) {
    this.send(id, JSON.stringify(data));
  },
  sendAll(message) {
    this.broadcast(message);
  },
  sendAllAsJson(data) {
    this.broadcast(
      JSON.stringify(data)
    );
  },
  sendCommand(id, command) {
    this.send(id, command());
  },
  sendAllCommand(command) {
    this.broadcast(command());
  },
  sendScript(id, file) {
    var that = this;
    fs.readFile('./payloads/'+file, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      that.send(id, data);
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
  list() {
    return clientPool.list();
  },
  remove(id) {
    clientPool.remove(id);
  }
};
