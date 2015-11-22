//var wss = location.search.match(/tab_slave=([^&]+)/);
var wss = 'ws://192.168.87.100:8080';
var ws;

var master = function() {
  ws = new WebSocket(wss);
  ws.onopen = function(event) {
    console.log('[V] Connected');
  }
  ws.onclose = function(event) {
    console.log('[X] Connection Closed');
  };
  ws.onmessage = function(messageEvent) {
    try {
      var data = JSON.parse(messageEvent.data);
      switch(data.type) {
        default:
          break;
      }
      console.log(data);
      
    } catch(e) {
      console.log(data);
    }
  };
  ws.onerror = function(data) {
    console.log('[E] Error, retrying to connecting');
  };
};

function promptLogin() {
  ws.send(
    JSON.stringify({
      type: "auth",
      nick: prompt('Username'),
      pass: prompt('Password')
    })
  );
};

master();
