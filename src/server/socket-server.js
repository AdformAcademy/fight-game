var Express = require('./express');
var Session = require('./session');
var SessionCollection = require('./session-collection');
var PlayerCollection = require('./player-collection');
var Player = require('./player');
var Config = require('./config');

var SocketServer = function() {};

SocketServer.http = require('http').Server(Express.app);

SocketServer.inputs = [];

SocketServer.prepareSocketData = function(player, opponent) {
	var data = {
		player: {
			x: player.getX(),
			y: player.getY(),
			z: player.getZ(),
			id: player.getLastProcessedInput()
		},
		opponent: {
			x: opponent.getX(),
			y: opponent.getY(),
			z: opponent.getZ(),
			id: opponent.getLastProcessedInput()
		}
	};
	return data;
};

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

SocketServer.deleteObjects = function(session) {
	if (session != null) {
		SessionCollection.deleteSession(session.sessionId);
		PlayerCollection.deletePlayer(session.sessionId);
	}
};

SocketServer.disconnectClient = function(socket) {
	var session = SessionCollection.getSessionObject(socket.id);
	if (session != null && session.opponentId != null) {
		var opponentSession = SessionCollection.getSessionObject(session.opponentId);
		opponentSession.socket.emit(Session.UNACTIVE);
	}
	SocketServer.deleteObjects(session);
	SocketServer.deleteObjects(opponentSession);
	SessionCollection.printSessions();
};

SocketServer.storeInput = function(socket, input) {
	if (SocketServer.inputs[socket.id] == null) {
		SocketServer.inputs[socket.id] = [];
	}
	console.log(input);
	SocketServer.inputs[socket.id].push(input);
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
			speedZ -= Config.playerAcceleration;
			z -= speedZ;
			if(opz - z < Config.playerSize){
				z = Math.abs(y - opy) - Config.playerSize;
				speedZ = 0;
			}
		}
		else {
			speedZ -= Config.playerAcceleration;
			z -= speedZ;
		}
		if(z > 0){
			z = 0;
			speedZ = 0;
		}
		player.setZ(z);
		player.setSpeedZ(speedZ);
	}	
};

SocketServer.executeInput = function(player, input) {
	var key = Player.KeyBindings;
	var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());

	var x = player.getX();
	var y = player.getY();
	var z = player.getZ();

	var opx = opponent.getX();
    var opy = opponent.getY();
    var opz = opponent.getZ();

	var speedZ = player.getSpeedZ();
    var size = Config.playerSize;

    var data = {
		player: {
			x: x,
			y: y,
			z: z
		},
		opponent: {
			x: opx,
			y: opy,
			z: opz
		}
	};
	
	if(input.jumpKey && z >= 0) {
		speedZ = Config.playerJumpSpeed;
		z -= speedZ;
		player.setSpeedZ(speedZ);
		player.setZ(z);
		SocketServer.updateZ(player);
	}
	if(input.key == key.UP_LEFT) {
		if(SocketServer.checkUpCollision(data, size))
			y -= Config.playerMoveSpeed;
		if(SocketServer.checkLeftCollision(data, size))
			x -= Config.playerMoveSpeed;
	}
	else if(input.key == key.UP_RIGHT) {
		if(SocketServer.checkUpCollision(data, size))
			y -= Config.playerMoveSpeed;
		if(SocketServer.checkRightCollision(data, size))
			x += Config.playerMoveSpeed;
	}
	else if(input.key == key.DOWN_LEFT) {
		if(SocketServer.checkDownCollision(data, size))
			y += Config.playerMoveSpeed;
		if(SocketServer.checkLeftCollision(data, size))
			x -= Config.playerMoveSpeed;
	}
	else if(input.key == key.DOWN_RIGHT) {
		if(SocketServer.checkDownCollision(data, size))
			y += Config.playerMoveSpeed;
		if(SocketServer.checkRightCollision(data, size))
			x += Config.playerMoveSpeed;
	}
	else if(input.key == key.LEFT) {
		if(SocketServer.checkLeftCollision(data, size))
			x -= Config.playerMoveSpeed;
	}
	else if(input.key == key.RIGHT) {
		if(SocketServer.checkRightCollision(data, size))
			x += Config.playerMoveSpeed;
	}
	else if(input.key == key.UP) {
		if(SocketServer.checkUpCollision(data, size))
			y -= Config.playerMoveSpeed;
	}
	else if(input.key == key.DOWN) {
		if(SocketServer.checkDownCollision(data, size))
			y += Config.playerMoveSpeed;
	}

	player.setX(x);
	player.setY(y);
}

SocketServer.checkLeftCollision = function(data, size) {
	return (((data.opponent.x + size < data.player.x || data.player.x <= data.opponent.x) || (data.player.y - size/3 >= data.opponent.y ||
											data.player.y + size/3 <= data.opponent.y)) || (data.opponent.z - size/3 >= data.player.z));
}
SocketServer.checkRightCollision = function(data, size) {
	return (((data.opponent.x - size > data.player.x || data.opponent.x <= data.player.x) || (data.player.y - size/3 >= data.opponent.y ||
											data.player.y + size/3 <= data.opponent.y)) || (data.opponent.z - size/3 >= data.player.z));
}
SocketServer.checkUpCollision = function(data, size) {
	return (((data.player.y - size/3 > data.opponent.y || data.player.y <= data.opponent.y) || (data.player.x - size >= data.opponent.x ||
											data.player.x + size <= data.opponent.x)) || (data.opponent.z - size/3 >= data.player.z));
}
SocketServer.checkDownCollision = function(data, size) {
	return (((data.player.y + size/3 < data.opponent.y || data.opponent.y <= data.player.y) || (data.player.x - size >= data.opponent.x ||
											data.player.x + size <= data.opponent.x)) || (data.opponent.z - size/3 >= data.player.z));
}

SocketServer.processInputs = function(player) {
	var sessionId = player.getID();
	var inputs = SocketServer.inputs[sessionId];
	if (inputs != null) {
		var i;
		for (i = 0; i < inputs.length; i++) {
			var input = inputs[i];
			if (input != null) {
				SocketServer.executeInput(player, input);
				player.setLastProcessedInput(input.id);
			}
		}
		inputs.splice(0, i + 1);
	}
};


SocketServer.updatePhysics = function() {
	var collection = SessionCollection.getCollection();
	for (var key in collection){
		var session = collection[key];
		if(session.state == Session.PLAYING){
			var sessionId = session.socket.id;
			var player = PlayerCollection.getPlayerObject(sessionId);
			if (player != null) {
				SocketServer.processInputs(player);
				SocketServer.updateZ(player);
			}
		}
	}
};

SocketServer.updateWorld = function() {
	var collection = SessionCollection.getCollection();
	for (var key in collection){
		var session = collection[key];
		if(session.state == Session.PLAYING){
			var playerObj = PlayerCollection.getPlayerObject(session.socket.id);
			if (playerObj != null) {
				var opponentObj = PlayerCollection.getPlayerObject(playerObj.getOpponentId());
				var data = SocketServer.prepareSocketData(playerObj, opponentObj);
				session.socket.emit('update', data);
			}
		}
	}
};

SocketServer.update = function() {
	SocketServer.updatePhysics();
	SocketServer.updateWorld();
};

SocketServer.listen = function() {
	SocketServer.http.listen(Config.port, function(){
		console.log('listening on *:' + Config.port);
	});
};

module.exports = SocketServer;