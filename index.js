var Express = require('./src/server/express');
Express.loadResources(__dirname);

var http = require('http').Server(Express.app);
var io = require('socket.io')(http);
var Session = require('./src/server/session');
var SessionCollection = require('./src/server/session-collection');
var Tasks = require('./src/server/tasks').start();
var PlayerCollection = require('./src/server/player-collection');
var Player = require('./src/server/player');

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

        var playerObj = new Player(sesObj.sessionId, sesObj.opponentId, 0, 0);
        var opponentObj = new Player(targetSesObj.sessionId, targetSesObj.opponentId, 100, 0);
        PlayerCollection.insertPlayer(sesObj.sessionId, playerObj);
        PlayerCollection.insertPlayer(targetSesObj.sessionId, opponentObj);

        sesObj.socket.emit(Session.PLAYING);
        targetSesObj.socket.emit(Session.PLAYING);
      }
    }
  });

socket.on('move', function(data){
  var playerObj = PlayerCollection.getPlayerObject(socket.id);
  var opponentObj = PlayerCollection.getPlayerObject(playerObj.getOpponentId());
  if (playerObj != null) {
    var key = Player.KeyBindings;
    var x = playerObj.getX();
    var y = playerObj.getY();
    var opx = opponentObj.getX();
    var opy = opponentObj.getY();
    console.log("X=", x);
    console.log("Y=", y);
    console.log("OPX=", opx);
    console.log("OPY=", opy);

    if(data == key.LEFT && x - opx > 30) {
        x -= 3;
        playerObj.setX(x);
    }
    if(data == key.RIGHT && opx - x > 30) {
        x += 3;
        playerObj.setX(x);
    }
    if(data == key.UP && y - opy > 30) {
        y -= 3;
        playerObj.setY(y);
    }
    if(data == key.DOWN && opy - y > 30) {
        y += 3;
        playerObj.setY(y);
    }
  }
});

socket.on('update', function(){
  var playerObj = PlayerCollection.getPlayerObject(socket.id);
  if (playerObj != null) {
    var opponentObj = PlayerCollection.getPlayerObject(playerObj.getOpponentId());
    var data = {
      player: {
        x: playerObj.getX(),
        y: playerObj.getY()
      },
      opponent: {
        x: opponentObj.getX(),
        y: opponentObj.getY()
      }
    };
    socket.emit('update', data);
  }
});

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});