var clientFactory = require('./ClientFactory.js');
var clientType = require('./ClientType');
var wss = require('./../wss/WebSocketServerFactory.js');

var pool = [];
var count = 0;

module.exports = {
  add(client) {
    pool.push(
      client
    );
    ++count;
  },
  identify(socketId, nick) {
    this.get(socketId).setNick(nick);
  },
  count: function() {
    return count;
  },
  get(socketId) {
    return pool[socketId];
  },
  getAll() {
    return pool;
  },
  getByNick(nick) {
    return this.get(
      this.getIndexByNick(nick)
    );
  },
  getIndexByNick(nick) {
    for(var i=0;i<this.pool.length;++i) {
      if(this.get(i).getNick() === nick) {
        return i;
      }
    }
  },
  remove(socketId) {
    delete pool[socketId];
    --count;
  }
};
