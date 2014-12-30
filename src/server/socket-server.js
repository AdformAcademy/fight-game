var Express = require('./express');
var Session = require('./session');
var SessionCollection = require('./session-collection');
var PlayerCollection = require('./player-collection');
var Player = require('./player');
var Config = require('./config');

var SocketServer = function() {};

SocketServer.http = require('http').Server(Express.app);

SocketServer.inputs = [];
SocketServer.proccessedInputs = [];
SocketServer.jumpInputs = [];

SocketServer.prepareSocketData = function(player, opponent) {
	var data = {
		player: {
			x: player.getX(),
			y: player.getY(),
			z: player.getZ(),
			input: player.getLastProcessedInput()
		},
		opponent: {
			x: opponent.getX(),
			y: opponent.getY(),
			z: opponent.getZ(), 
			sequence: SocketServer.proccessedInputs[opponent.getID()] || []
		}
	};
	return data;
};

SocketServer.prepareClient = function (socket) {
	if (!SessionCollection.sessionExists(socket.id)) {
		var targetSession = SessionCollection.getAvailableSession();
		SessionCollection.createSession(socket);
		console.log(socket.id + ' is ready');
		if (targetSession !== undefined) {
			var session = SessionCollection.getSessionObject(socket.id);

			session.opponentId = targetSession.sessionId;
			session.state = Session.PLAYING;
			targetSession.opponentId = session.sessionId;
			targetSession.state = Session.PLAYING;

			var player = Player({
				id: session.sessionId,
				opponentId: session.opponentId,
				x: 0,
				y: 500,
				z: 0
			});
			var opponent = Player({
				id: targetSession.sessionId,
				opponentId: targetSession.opponentId,
				x: 100,
				y: 500,
				z: 0
			});
			PlayerCollection.insertPlayer(session.sessionId, player);
			PlayerCollection.insertPlayer(targetSession.sessionId, opponent);

			SocketServer.inputs[session.sessionId] = [];
			SocketServer.inputs[targetSession.sessionId] = [];
			SocketServer.proccessedInputs[session.sessionId] = [];
			SocketServer.proccessedInputs[targetSession.sessionId] = [];
			SocketServer.jumpInputs[session.sessionId] = [];
			SocketServer.jumpInputs[targetSession.sessionId] = [];

			session.socket.emit(Session.PLAYING);
			targetSession.socket.emit(Session.PLAYING);
		}
	}
};

SocketServer.deleteObjects = function(session) {
	if (session !== undefined) {
		SessionCollection.deleteSession(session.sessionId);
		PlayerCollection.deletePlayer(session.sessionId);
		delete SocketServer.inputs[session.sessionId];
		delete SocketServer.proccessedInputs[session.sessionId];
		delete SocketServer.jumpInputs[session.sessionId];
	}
};

SocketServer.disconnectClient = function(socket) {
	var session = SessionCollection.getSessionObject(socket.id);
	if (session !== undefined && session.opponentId !== null) {
		var opponentSession = SessionCollection.getSessionObject(session.opponentId);
		opponentSession.socket.emit(Session.UNACTIVE);
	}
	socket.emit(Session.UNACTIVE);
	SocketServer.deleteObjects(session);
	SocketServer.deleteObjects(opponentSession);
	SessionCollection.printSessions();
};

SocketServer.storeInput = function(socket, input) {
	var session = SessionCollection.getSessionObject(socket.id);
	if (session !== undefined && SocketServer.inputs[socket.id] !== undefined) {
		SocketServer.inputs[socket.id].push(input);
	} else {
		SocketServer.disconnectClient(socket);
	}
};

SocketServer.updateZ = function(player) {
	var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());
    var x = player.getX();
    var y = player.getY();
    var z = player.getZ();
    var opx = opponent.getX();
    var opy = opponent.getY();
    var opz = opponent.getZ();
    var speedZ = player.getSpeedZ();
       
    if(z < 0 || player.isJumping()) {
    	if(y + z <= 0) {
    		z = -y;
    		speedZ = 0;
    	}
		if(Math.abs(x - opx) < Config.playerSize && Math.abs(y - opy) < Config.playerSize / 3) {
			speedZ -= Config.playerAcceleration;
			z -= speedZ;
			if(opz - z < Config.playerSize) {
				z = Math.abs(y - opy) - Config.playerSize;
				speedZ = 0;
			}
		}
		else {
			speedZ -= Config.playerAcceleration;
			z -= speedZ;
		}
		if(z >= 0) {
			z = 0;
			speedZ = 0;
			player.setJumping(false);
		}
	};
	player.setZ(z);
	player.setSpeedZ(speedZ);
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
	
	if(input.jumpKey && !player.isJumping()) {
		speedZ = Config.playerJumpSpeed;
		player.setSpeedZ(speedZ);
		player.setJumping(true);
	}
	else if(input.jumpKey && player.isJumping()) {
		var inputs = SocketServer.jumpInputs[player.getID()];
		if(inputs !== undefined) {
			inputs.push(input);
		}
	}

	if(input.key === key.UP_LEFT) {
		if(SocketServer.checkUpCollision(data, size))
			y -= Config.playerMoveSpeed;
		if(SocketServer.checkLeftCollision(data, size))
			x -= Config.playerMoveSpeed;
	}
	else if(input.key === key.UP_RIGHT) {
		if(SocketServer.checkUpCollision(data, size))
			y -= Config.playerMoveSpeed;
		if(SocketServer.checkRightCollision(data, size))
			x += Config.playerMoveSpeed;
	}
	else if(input.key === key.DOWN_LEFT) {
		if(SocketServer.checkDownCollision(data, size))
			y += Config.playerMoveSpeed;
		if(SocketServer.checkLeftCollision(data, size))
			x -= Config.playerMoveSpeed;
	}
	else if(input.key === key.DOWN_RIGHT) {
		if(SocketServer.checkDownCollision(data, size))
			y += Config.playerMoveSpeed;
		if(SocketServer.checkRightCollision(data, size))
			x += Config.playerMoveSpeed;
	}
	else if(input.key === key.LEFT) {
		if(SocketServer.checkLeftCollision(data, size))
			x -= Config.playerMoveSpeed;
	}
	else if(input.key === key.RIGHT) {
		if(SocketServer.checkRightCollision(data, size))
			x += Config.playerMoveSpeed;
	}
	else if(input.key === key.UP) {
		if(SocketServer.checkUpCollision(data, size))
			y -= Config.playerMoveSpeed;
	}
	else if(input.key === key.DOWN) {
		if(SocketServer.checkDownCollision(data, size))
			y += Config.playerMoveSpeed;
	}

	player.setX(x);
	player.setY(y);
}

SocketServer.checkLeftCollision = function(data, size) {
	return (((data.opponent.x + size < data.player.x || data.player.x <= data.opponent.x) 
		|| (data.player.y - size/3 >= data.opponent.y || data.player.y + size/3 <= data.opponent.y)) 
		|| (data.opponent.z - size/3 >= data.player.z));
}
SocketServer.checkRightCollision = function(data, size) {
	return (((data.opponent.x - size > data.player.x || data.opponent.x <= data.player.x) 
		|| (data.player.y - size/3 >= data.opponent.y || data.player.y + size/3 <= data.opponent.y)) 
		|| (data.opponent.z - size/3 >= data.player.z));
}
SocketServer.checkUpCollision = function(data, size) {
	return (((data.player.y - size/3 > data.opponent.y || data.player.y <= data.opponent.y) 
		|| (data.player.x - size >= data.opponent.x || data.player.x + size <= data.opponent.x)) 
	 	|| (data.opponent.z - size/3 >= data.player.z));
}
SocketServer.checkDownCollision = function(data, size) {
	return (((data.player.y + size/3 < data.opponent.y || data.opponent.y <= data.player.y) 
		|| (data.player.x - size >= data.opponent.x || data.player.x + size <= data.opponent.x)) 
		|| (data.opponent.z - size/3 >= data.player.z));
}

SocketServer.updatePlayerPhysics = function(player) {
	SocketServer.updateZ(player);
};

SocketServer.processPlayerInputs = function(player) {
	var sessionId = player.getID();
	var inputs = SocketServer.inputs[sessionId];
	var input = inputs[0];
	if (inputs !== undefined && input !== undefined) {
		SocketServer.executeInput(player, input);
		inputs.shift();
	}
	return input;
};

SocketServer.updatePlayer = function(player) {
	if (player !== undefined) {
		var sessionId = player.getID();
		var jumpInputs = SocketServer.jumpInputs[sessionId];
		var input = SocketServer.processPlayerInputs(player);

		if (input !== undefined) {
			SocketServer.updatePlayerPhysics(player);
			player.setLastProcessedInput(input);
			var location = player.getLocation();
			SocketServer.proccessedInputs[sessionId].push(location);
		}

		if (!player.isJumping()) {
			var input = jumpInputs[0];
		    if (input !== undefined) {
		        SocketServer.executeInput(player, input);
		        jumpInputs.shift();
		    }
		}
	}
};

SocketServer.updatePlayers = function() {
	var collection = SessionCollection.getCollection();
	for (var key in collection) {
		var session = collection[key];
		if(session.state === Session.PLAYING) {
			var sessionId = session.socket.id;
			var player = PlayerCollection.getPlayerObject(sessionId);
			SocketServer.updatePlayer(player);
		}
	}
};

SocketServer.updateWorld = function() {
	var collection = SessionCollection.getCollection();
	for (var key in collection) {
		var session = collection[key];
		if(session.state === Session.PLAYING) {
			var player = PlayerCollection.getPlayerObject(session.socket.id);
			if (player !== undefined) {
				var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());
				var data = SocketServer.prepareSocketData(player, opponent);		
				session.socket.emit('update', data);
				SocketServer.proccessedInputs[opponent.getID()] = [];
			}
		}
	}
};

SocketServer.listen = function() {
	SocketServer.http.listen(Config.port, function() {
		console.log('listening on *:' + Config.port);
	});
};

module.exports = SocketServer;