var uri = location.search.match(/___ws=([^&]+)/);
var wss = uri ? uri : 'ws://localhost:8080';
var reconnectTries = 0;
var lastReconnectTries = 0;
var timeoutId;
var ws;

var slave = function() {
  ++reconnectTries;
  console.log('Connecting')
  ws = new WebSocket(wss);
  ws.onopen = function(event) {
    clearTimeout(timeoutId);
    lastReconnectTries = reconnectTries;
    reconnectTries = 0;
    console.log('[V] Connected');
  }
  ws.onclose = function(event) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(slave, 5000);
    console.log('[X] Connection Closed');
  };
  ws.onmessage = function(data) {
    eval(data.data)
  };
  ws.onerror = function(data) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(slave, 5000);
    console.log('[E] Error, retrying to connecting');
  };
};

function identify(ws, nick) {
  ws.send(
    JSON.stringify({
      type: "nick",
      nick: nick
    })
  );
};

slave();
