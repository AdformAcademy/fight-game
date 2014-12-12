var Express = require('./src/server/express');
Express.loadResources(__dirname);

var http = require('http').Server(Express.app);
var io = require('socket.io')(http);
var Session = require('./src/server/session');
var SessionCollection = require('./src/server/session-collection');
var Tasks = require('./src/server/tasks').start();

io.on('connection', function(socket){

  socket.on('disconnect', function(){
    var sesObj = SessionCollection.getSessionObject(socket.id);
    if (sesObj != null && sesObj.opponentId != null) {
      var targetSesObj = SessionCollection.getSessionObject(sesObj.opponentId);
      targetSesObj.socket.emit(Session.UNACTIVE);
      SessionCollection.deleteSession(sesObj.opponentId);
    }
    console.log('user disconnected');
    SessionCollection.deleteSession(socket.id);
  });

  socket.on('ready', function() {
    if (!SessionCollection.sessionExists(socket.id)) {
      var targetSesObj = SessionCollection.getAvailableSession();
      SessionCollection.createSession(socket);
      console.log(socket.id + ' is ready');
      if (targetSesObj != null) {
        var sesObj = SessionCollection.getSessionObject(socket.id);
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