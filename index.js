var config = require('./config.js');
var repl = require('./src/Repl.js');
var webserverBootstrap = require('./webserverBootstrap.js');
var websocketEventHandler = require('./src/ws/EventHandler.js');

if(config.ws.enabled) {
  webserverBootstrap();
}

websocketEventHandler();

if(config.repl) {
  repl.start();
}


  /*
  tinyUrl url creator
  request.get(
    'http://tinyurl.com/api-create.php?url=http://'+config.ws.host+':'+config.ws.port,
    function (error, response, body) {
        console.log(body);
    }
  );
  */
