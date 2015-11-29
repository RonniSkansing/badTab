var repl = require("repl");
var clientPoolService = require('./client/ClientPoolService.js');
var wss = require('./wss/WebSocketServerFactory.js');

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
    this.loop.context.service = clientPoolService;
    this.loop.context.repl = this;
  },
  shutdown: () => {
    process.exit(0);
  }
};
