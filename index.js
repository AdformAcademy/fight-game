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

        var playerObj = Player(sesObj.sessionId(), targetSesObj.sessionId(), 0, 0);
        var opponentObj = Player(targetSesObj.sessionId(), sesObj.sessionId(), 100, 0);
        PlayerCollection.insertPlayer(sesObj.sessionId(), playerObj);
        PlayerCollection.insertPlayer(targetSesObj.sessionId(), opponentObj);

        sesObj.opponentId = targetSesObj.sessionId;
        sesObj.state = Session.PLAYING;
        targetSesObj.opponentId = sesObj.sessionId;
        targetSesObj.state = Session.PLAYING;
        sesObj.socket.emit(Session.PLAYING);
        targetSesObj.socket.emit(Session.PLAYING);
      }
  });

  socket.on('move', function(data){
        var playerObj = PlayerCollection.getPlayerObject(socket.id);
        var key = Player.KeyBindings;
        var x = playerObj.getX();
        var y = playerObj.getY();
        if(data == key.LEFT) {
          x -= 1;
          playerObj.setX(x);
        }
        if(data == key.RIGHT) {
          x += 1;
          playerObj.setX(x);
        }
        if(data == key.UP) {
          y -= 1;
          playerObj.setY(y);
        }
        if(data == key.DOWN) {
          y += 1;
          playerObj.setY(y);
        }
    }
  });
  socket.on('update', function(){
    var player = PlayerCollection.getPlayerObject(socket.id);
    var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());
    var data = {
      player: {
        x: player.getX(),
        y: player.getY()
      },
      opponent: {
        x: opponent.getX(),
        y: opponent.getY()
      }
    };
  socket.emit('update', data);
});

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});