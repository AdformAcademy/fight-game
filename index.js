var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var session = require('./src/session');
var sessions = [];

app.get('/', function(req, res){
  res.sendfile('views/index.html');
});

app.get('/public/js/connection.js', function(req, res){
  res.sendfile('public/js/connection.js');
});

io.on('connection', function(socket){

  socket.on('disconnect', function(){
    var sesObj = getSessionObject(socket.id);
    if (sesObj.opponentId != null) {
      var targetSesObj = getSessionObject(sesObj.opponentId);
      io.sockets.connected[targetSesObj.socket].emit('unactive');
      deleteSession(sesObj.opponentId);
      console.log('Send unactive response to target player');
    }
    console.log('user disconnected');
    deleteSession(socket.id);
  });

  socket.on('ready', function() {
    if (!sessionExists(socket.id)) {
      var targetSesObj = getAvailableSession();
      createSession(socket);
      console.log(socket.id + ' is ready');
      if (targetSesObj != null) {
        var sesObj = getSessionObject(socket.id);
        sesObj.opponentId = targetSesObj.sessionId;
        sesObj.state = 'playing';
        targetSesObj.opponentId = sesObj.sessionId;
        targetSesObj.state = 'playing';
        //TODO send response to both players
        io.sockets.connected[sesObj.socket].emit('playing');
        io.sockets.connected[targetSesObj.socket].emit('playing');
        console.log('Available connection between players');
      }
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function getSessionObject(sessionId) {
  return sessions[sessionId];
}

function getAvailableSession() {
  for (var key in sessions) {
    var sesObj = sessions[key];
    if (sesObj.state == 'ready') {
      return sesObj;
    }
  }
  return null;
}

function sessionExists(sessionId) {
  return sessions[sessionId] != null;
}

function createSession(socket) {
  var sesObj = new session(socket, null, 'ready');
  sessions[socket.id] = sesObj;
}

function deleteSession(sessionId) {
  delete sessions[sessionId];
}

function printSessions() {
  console.log('Sessions: ');
  for (var key in sessions) {
    console.log(sessions[key].toString());
  }
}