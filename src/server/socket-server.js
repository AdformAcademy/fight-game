var Express = require('./express');
var Session = require('./session');
var SessionCollection = require('./session-collection');
var PlayerCollection = require('./player-collection');
var Player = require('./player');
var Config = require('./config');

var SocketServer = function() {};

SocketServer.http = require('http').Server(Express.app);

SocketServer.prepareSocketData = function(player, opponent) {
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
	return data;
}

SocketServer.prepareClient = function (socket) {
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
};

SocketServer.disconnectClient = function(socket) {
	var sesObj = SessionCollection.getSessionObject(socket.id);
	if (sesObj != null && sesObj.opponentId != null) {
		var targetSesObj = SessionCollection.getSessionObject(sesObj.opponentId);
		targetSesObj.socket.emit(Session.UNACTIVE);
		SessionCollection.deleteSession(sesObj.opponentId);
	}
	console.log('user disconnected');
	SessionCollection.deleteSession(socket.id);
};

SocketServer.updateClient = function(socket, data) {
	var playerObj = PlayerCollection.getPlayerObject(socket.id);
	if (playerObj != null) {
		if(data != 0){
			SocketServer.updateClientCoordinates(playerObj, data);
		}
		var opponentObj = PlayerCollection.getPlayerObject(playerObj.getOpponentId());
		var data = SocketServer.prepareSocketData(playerObj, opponentObj);
		socket.emit('update', data);
	}
};

SocketServer.updateClientCoordinates = function(player, input) {
	var key = Player.KeyBindings;
	var x = player.getX();
	var y = player.getY();
	if(input == key.UP_LEFT) {
		y -= Config.playerMoveSpeed;
		x -= Config.playerMoveSpeed;
	}
	else if(input == key.UP_RIGHT) {
		y -= Config.playerMoveSpeed;
		x += Config.playerMoveSpeed;
	}
	else if(input == key.DOWN_LEFT) {
		x -= Config.playerMoveSpeed;
		y += Config.playerMoveSpeed;
	}
	else if(input == key.DOWN_RIGHT) {
		x += Config.playerMoveSpeed;
		y += Config.playerMoveSpeed;
	}
	else if(input == key.LEFT) {
		x -= Config.playerMoveSpeed;
	}
	else if(input == key.RIGHT) {
		x += Config.playerMoveSpeed;
	}
	else if(input == key.UP) {
		y -= Config.playerMoveSpeed;
	}
	else if(input == key.DOWN) {
		y += Config.playerMoveSpeed;
	}
	player.setX(x);
	player.setY(y); 
};

SocketServer.listen = function() {
	SocketServer.http.listen(Config.port, function(){
		console.log('listening on *:' + Config.port);
	});
};

module.exports = SocketServer;