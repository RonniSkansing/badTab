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
  add(ip, origin, agent, client, sender) {
    this.pool.push(clientFactory(
      ++this.clientId,
      clientType.slave,
      ip,
      origin,
      agent,
      client,
      sender
    ));
    return this.clientId;
  },
  identify(id, nick) {
    this.pool[id].nick = nick;
  },
  list() {
    var clientIdentifiers = [];
    for(var i=0; i<this.pool.length; ++i) {
      var client = this.pool[i];
      clientIdentifiers.push({
        id: client.id,
        nick: client.nick,
        authenticated: client.authenticated,
        type: client.type
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
  // @todo this doesnt work..
  remove(id) {
    this.pool[id] = null;
    //this.pool.splice(id, 1);
  }
};
