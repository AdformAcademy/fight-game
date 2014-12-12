var Express = require('./src/server/express');
Express.loadResources(__dirname);

var http = require('http').Server(Express.app);
var io = require('socket.io')(http);
var Session = require('./src/server/session');
var SessionCollection = require('./src/server/session-collection');
var Tasks = require('./src/server/tasks').start();
var PlayerCollection = require('./src/server/player-collection');
var Player = require('./src/server/player');
var Config = require('./src/server/config');

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

  socket.on('update', function(data){

    var playerObj = PlayerCollection.getPlayerObject(socket.id);
    if (playerObj != null) {
      if(data != 0){
        var key = Player.KeyBindings;
        var x = playerObj.getX();
        var y = playerObj.getY();
        if(data == key.UP_LEFT) {
          y -= Config.playerMoveSpeed;
          x -= Config.playerMoveSpeed;
        }
        else if(data == key.UP_RIGHT) {
          y -= Config.playerMoveSpeed;
          x += Config.playerMoveSpeed;
        }
        else if(data == key.DOWN_LEFT) {
          x -= Config.playerMoveSpeed;
          y += Config.playerMoveSpeed;
        }
        else if(data == key.DOWN_RIGHT) {
          x += Config.playerMoveSpeed;
          y += Config.playerMoveSpeed;
        }
        else if(data == key.LEFT) {
          x -= Config.playerMoveSpeed;
        }
        else if(data == key.RIGHT) {
          x += Config.playerMoveSpeed;
        }
        else if(data == key.UP) {
          y -= Config.playerMoveSpeed;
        }
        else if(data == key.DOWN) {
          y += Config.playerMoveSpeed;
        }

        playerObj.setX(x);
        playerObj.setY(y);  
      }
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

http.listen(Config.port, function(){
  console.log('listening on *:' + Config.port);
});