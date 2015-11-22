var fs = require('fs');
var config = require('../../config');
var clientFactory = require('./ClientFactory.js');
var clientType = require('./ClientType');
var commands = require('./../Commands.js')
var wss = require('./../WebSocketServerFactory.js');

// @todo replace mock
function auth(user, pass) {
  return (user === 'admin' && pass === 'admin');
}

module.exports = {
  clientId: -1,
  pool: [],
  count() {
    return this.pool.length;
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
    var client = this.pool[id];
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
  add(client, nick) {
    this.pool.push(clientFactory(
      ++this.clientId,
      nick,
      clientType.slave,
      client
    ));

    return this.clientId;
  },
  broadcast(message, type) {
    this.pool.forEach( (client) => {
      if(client.type === clientType.slave) {
        client.sender.send(message);
      }
    });
  },
  broadcastToMasters(message) {
    this.pool.forEach( (client) => {
      if(client.type === clientType.master) {
        client.sender.send(message);
      }
    });
  },
  identify(id, nick) {
    this.pool[id].nick = nick;
  },
  list() {
    var clientIdentifiers = [];
    for(var i=0; i<this.pool.length; ++i) {
      clientIdentifiers.push({
        id: this.pool[i].id,
        nick: this.pool[i].nick,
        authenticated: this.pool[i].authenticated,
        type: this.pool[i].type
      });
    }
    return clientIdentifiers;
  },
  get(id) {
    return this.pool[id];
  },
  getByNick(nick) {
    return this.pool[
      this.getIndexByNick(nick)
    ];
  },
  getIndexByNick(nick) {
    for(var i=0;i<this.pool.length;++i) {
      if(this.pool[i].nick === nick) {
        return i;
      }
    }
  },
  send(id, message) {
    var client = this.pool[id];
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
  // @todo this doesnt work..
  remove(id) {
    this.pool[id] = null;
    //this.pool.splice(id, 1);
  }
};
