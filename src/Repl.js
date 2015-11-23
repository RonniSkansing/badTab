var repl = require("repl");
var clients = require('./client/Clients.js');
var commands = require('./Commands.js');
var wss = require('./WebSocketServerFactory.js');

module.exports = {
  loop: null,
  start: function() {
    console.log('>> REPL Started. See Clients, Commands');
    this.loop = repl.start({
      prompt: '',
      input: process.stdin,
      output: process.stdout
    });
    this.loop.context.wss = wss;
    this.loop.context.clients = clients;
    this.loop.context.commands = commands;
    this.loop.context.repl = this;
  },
  shutdown: () => {
    process.exit(0);
  }
};
