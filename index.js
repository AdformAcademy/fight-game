var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Session = require('./src/Session');
var Sessions = require('./src/Sessions');

app.get('/', function(req, res){
  res.sendfile('views/index.html');
});

app.get('/public/js/connection.js', function(req, res){
  res.sendfile('public/js/connection.js');
});

io.on('connection', function(socket){

  socket.on('disconnect', function(){
    var sesObj = Sessions.getSessionObject(socket.id);
    if (sesObj != null && sesObj.opponentId != null) {
      var targetSesObj = Sessions.getSessionObject(sesObj.opponentId);
      targetSesObj.socket.emit(Session.UNACTIVE);
      Sessions.deleteSession(sesObj.opponentId);
    }
    console.log('user disconnected');
    Sessions.deleteSession(socket.id);
  });

  socket.on('ready', function() {
    if (!Sessions.sessionExists(socket.id)) {
      var targetSesObj = Sessions.getAvailableSession();
      Sessions.createSession(socket);
      console.log(socket.id + ' is ready');
      if (targetSesObj != null) {
        var sesObj = Sessions.getSessionObject(socket.id);
        sesObj.opponentId = targetSesObj.sessionId;
        sesObj.state = Session.PLAYING;
        targetSesObj.opponentId = sesObj.sessionId;
        targetSesObj.state = Session.PLAYING;
        sesObj.socket.emit(Session.PLAYING);
        targetSesObj.socket.emit(Session.PLAYING);
      }
    }
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});