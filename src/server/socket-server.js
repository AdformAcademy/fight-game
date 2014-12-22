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
			y: player.getY(),
			z: player.getZ(),
		},
		opponent: {
			x: opponent.getX(),
			y: opponent.getY(),
			z: opponent.getZ(),
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

			var playerObj = new Player(sesObj.sessionId, sesObj.opponentId, 0, 600);
			playerObj.setZ(-400);
			var opponentObj = new Player(targetSesObj.sessionId, targetSesObj.opponentId, 100, 600);
			opponentObj.setZ(-300);
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
	}
};

SocketServer.updateZ = function(player) {
	var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());
	var x = player.getX();
	var y = player.getY();
	var z = player.getZ();
	var speedZ = player.getSpeedZ();
	var opx = opponent.getX();
    var opy = opponent.getY();
    var opz = opponent.getZ();

	if(z < 0){
		if(Math.abs(x - opx) < Config.playerSize && Math.abs(y - opy) < Config.playerSize / 3){
			console.log(Math.abs(x - opx));
			speedZ -= Config.playerAcceleration
			z -= speedZ;
			if(opz - z < Config.playerSize){
				z = Math.abs(y - opy) - Config.playerSize;
				speedZ = 0;
			}
		}
		else {
			speedZ -= Config.playerAcceleration
			z -= speedZ;}
		if(z > 0){
			z = 0;
			speedZ = 0;
		}

		player.setZ(z);
		player.setSpeedZ(speedZ);
	}	
}

SocketServer.updateClientCoordinates = function(player, input) {
	var key = Player.KeyBindings;
	var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());

	var x = player.getX();
	var y = player.getY();
	var z = player.getZ();
	var speedZ = player.getSpeedZ();

	var opx = opponent.getX();
    var opy = opponent.getY();
    var opz = opponent.getZ();

	if(input.jumpKey && z >= 0) {
		speedZ = Config.playerJumpSpeed;
		z -= speedZ;
		player.setSpeedZ(speedZ);
		player.setZ(z);
		SocketServer.updateZ(player);
	}

	if(input.key == key.UP_LEFT) {
		if(((y - Config.playerSize/3 > opy || y <= opy) || (x - Config.playerSize >= opx || x + Config.playerSize <= opx)) || (opz - Config.playerSize/3 >= z))
			y -= Config.playerMoveSpeed;
		if(((opx + Config.playerSize < x || x <= opx) || (y - Config.playerSize/3 >= opy || y + Config.playerSize/3 <= opy)) || (opz - Config.playerSize/3 >= z))
			x -= Config.playerMoveSpeed;
	}
	else if(input.key == key.UP_RIGHT) {
		if(((y - Config.playerSize/3 > opy || y <= opy) || (x - Config.playerSize >= opx || x + Config.playerSize <= opx)) || (opz - Config.playerSize/3 >= z))
			y -= Config.playerMoveSpeed;
		if(((opx - Config.playerSize > x || opx <= x) || (y - Config.playerSize/3 >= opy || y + Config.playerSize/3 <= opy)) || (opz - Config.playerSize/3 >= z))
			x += Config.playerMoveSpeed;
	}
	else if(input.key == key.DOWN_LEFT) {
		if(((y + Config.playerSize/3 < opy || opy <= y) || (x - Config.playerSize >= opx || x + Config.playerSize <= opx)) || (opz - Config.playerSize/3 >= z))
			y += Config.playerMoveSpeed;
		if(((opx + Config.playerSize < x || x <= opx) || (y - Config.playerSize/3 >= opy || y + Config.playerSize/3 <= opy)) || (opz - Config.playerSize/3 >= z))
			x -= Config.playerMoveSpeed;
	}
	else if(input.key == key.DOWN_RIGHT) {
		if(((y + Config.playerSize/3 < opy || opy <= y) || (x - Config.playerSize >= opx || x + Config.playerSize <= opx)) || (opz - Config.playerSize/3 >= z))
			y += Config.playerMoveSpeed;
		if(((opx - Config.playerSize > x || opx <= x) || (y - Config.playerSize/3 >= opy || y + Config.playerSize/3 <= opy)) || (opz - Config.playerSize/3 >= z))
			x += Config.playerMoveSpeed;
	}
	else if(input.key == key.LEFT) {
		if(((opx + Config.playerSize < x || x <= opx) || (y - Config.playerSize/3 >= opy || y + Config.playerSize/3 <= opy)) || (opz - Config.playerSize/3 >= z))
			x -= Config.playerMoveSpeed;
	}
	else if(input.key == key.RIGHT) {
		if(((opx - Config.playerSize > x || opx <= x) || (y - Config.playerSize/3 >= opy || y + Config.playerSize/3 <= opy)) || (opz - Config.playerSize/3 >= z))
			x += Config.playerMoveSpeed;
	}
	else if(input.key == key.UP) {
		if(((y - Config.playerSize/3 > opy || y <= opy) || (x - Config.playerSize >= opx || x + Config.playerSize <= opx)) || (opz - Config.playerSize/3 >= z))
			y -= Config.playerMoveSpeed;
	}
	else if(input.key == key.DOWN) {
		if(((y + Config.playerSize/3 < opy || opy <= y) || (x - Config.playerSize >= opx || x + Config.playerSize <= opx)) || (opz - Config.playerSize/3 >= z))
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