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
SocketServer.punchInputs = [];

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
				x: Config.firstSpawnLocation.x,
				y: Config.firstSpawnLocation.y,
				z: Config.firstSpawnLocation.z
			});
			var opponent = Player({
				id: targetSession.sessionId,
				opponentId: targetSession.opponentId,
				x: Config.secondSpawnLocation.x,
				y: Config.secondSpawnLocation.y,
				z: Config.secondSpawnLocation.z
			});
			PlayerCollection.insertPlayer(session.sessionId, player);
			PlayerCollection.insertPlayer(targetSession.sessionId, opponent);

			SocketServer.inputs[session.sessionId] = [];
			SocketServer.inputs[targetSession.sessionId] = [];

			SocketServer.proccessedInputs[session.sessionId] = [];
			SocketServer.proccessedInputs[targetSession.sessionId] = [];

			SocketServer.jumpInputs[session.sessionId] = [];
			SocketServer.jumpInputs[targetSession.sessionId] = [];

			SocketServer.punchInputs[session.sessionId] = [];
			SocketServer.punchInputs[targetSession.sessionId] = [];

			session.socket.emit(Session.PLAYING, {
				player: {
					x: player.getX(),
					y: player.getY(),
					image: 'player1.png'
				},
				opponent: {
					x: opponent.getX(),
					y: opponent.getY(),
					image: 'player2.png'
				}
			});
			targetSession.socket.emit(Session.PLAYING, {
				player: {
					x: opponent.getX(),
					y: opponent.getY(),
					image: 'player2.png'
				},
				opponent: {
					x: player.getX(),
					y: player.getY(),
					image: 'player1.png'
				}
			});
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
		delete SocketServer.punchInputs[session.sessionId];
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

SocketServer.storeInput = function(socket, packet) {
	var session = SessionCollection.getSessionObject(socket.id);
	if (session !== undefined && SocketServer.inputs[socket.id] !== undefined) {
		SocketServer.inputs[socket.id].push(packet);
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
		if(Math.abs(x - opx) < Config.playerSize && Math.abs(y - opy) < Config.playerSize / 3){
			speedZ -= Config.playerAcceleration;
			z -= speedZ;
			if(z >= -(y + Config.playerSize - opy)){
				z = -(y + Config.playerSize - opy);
				speedZ = 0;
			}
		} else {
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

SocketServer.punch = function(player) {
	var t = 0;
	var punched = 0;
	var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());
	var x = player.getX();
    var y = player.getY();
    var z = player.getZ();
    var opx = opponent.getX();
    var opy = opponent.getY();
    var opz = opponent.getZ();
    console.log('start function');
	var updateP = setInterval(function(){
		t += 30;
		if(SocketServer.checkPunchCollisionLeft(player, opponent, 60)){
			console.log('You punched something');
			punched = 1;
		}
		if(SocketServer.checkPunchCollisionRight(player, opponent, 60)){
			console.log('You punched something');
			punched = 2;
		}
		if(t >= 400){
			if(punched == 1){
				opx +=10;
				player.setX(x);
				opponent.setX(opx);
			}
			else if(punched == 2){
				opx -=10;
				player.setX(x);
				opponent.setX(opx);
			}
			console.log('You done your punching');
			player.setPunching(false);
			clearInterval(updateP);
		}
	}, 1000/30);
};

SocketServer.checkPunchCollisionLeft = function(player, opponent, size) {
	return (player.getX() < opponent.getX() && opponent.getX() - player.getX() < size
		&& (Math.abs(player.getY() - opponent.getY()) <= 50*2/3)
		&& (Math.abs(player.getZ() - opponent.getZ()) <= size));
}

SocketServer.checkPunchCollisionRight = function(player, opponent, size) {
	return (player.getX() > opponent.getX() && player.getX() - opponent.getX() < size
		&& (Math.abs(player.getY() - opponent.getY()) <= 50*2/3)
		&& (Math.abs(player.getZ() - opponent.getZ()) <= size));
}

SocketServer.executeInput = function(player, input) {
	var key = Config.keyBindings;
	var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());

	var x = player.getX();
	var y = player.getY();
	var z = player.getZ();
	var opy = opponent.getY();
	var opz = opponent.getZ();

	var speedZ = player.getSpeedZ();
    var size = Config.playerSize;

	if(input.jumpKey && !player.isJumping() && y - opz - opy != Config.playerSize) {
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

	if(input.punchKey && !player.isPunching()) {
		player.setPunching(true);
		console.log('received input');
		SocketServer.punch(player);
	}
	else if(input.punchKey && player.isPunching()) {
		console.log('input -> inputs[]');
		var inputs = SocketServer.punchInputs[player.getID()];
		if(inputs !== undefined) {
			inputs.push(input);
		}
	}

	if(input.key === key.UP_LEFT) {
		if(SocketServer.checkUpCollision(player, opponent, size))
			y -= Config.playerMoveSpeed;
		if(SocketServer.checkLeftCollision(player, opponent, size))
			x -= Config.playerMoveSpeed;
	}
	else if(input.key === key.UP_RIGHT) {
		if(SocketServer.checkUpCollision(player, opponent, size))
			y -= Config.playerMoveSpeed;
		if(SocketServer.checkRightCollision(player, opponent, size))
			x += Config.playerMoveSpeed;
	}
	else if(input.key === key.DOWN_LEFT) {
		if(SocketServer.checkDownCollision(player, opponent, size))
			y += Config.playerMoveSpeed;
		if(SocketServer.checkLeftCollision(player, opponent, size))
			x -= Config.playerMoveSpeed;
	}
	else if(input.key === key.DOWN_RIGHT) {
		if(SocketServer.checkDownCollision(player, opponent, size))
			y += Config.playerMoveSpeed;
		if(SocketServer.checkRightCollision(player, opponent, size))
			x += Config.playerMoveSpeed;
	}
	else if(input.key === key.LEFT) {
		if(SocketServer.checkLeftCollision(player, opponent, size))
			x -= Config.playerMoveSpeed;
	}
	else if(input.key === key.RIGHT) {
		if(SocketServer.checkRightCollision(player, opponent, size))
			x += Config.playerMoveSpeed;
	}
	else if(input.key === key.UP) {
		if(SocketServer.checkUpCollision(player, opponent, size))
			y -= Config.playerMoveSpeed;
	}
	else if(input.key === key.DOWN) {
		if(SocketServer.checkDownCollision(player, opponent, size))
			y += Config.playerMoveSpeed;
	}
	else if (input.key === key.DEFEND) {
		player.setDefending(true);
	} else {
		player.setDefending(false);
	}

	player.setX(x);
	player.setY(y);
	player.setCurrentAnimation(input.animationName);
}

SocketServer.checkLeftCollision = function(player, opponent, size) {
	return (opponent.getX() + size < player.getX() || player.getX() <= opponent.getX())
		|| (Math.abs(player.getY() - opponent.getY()) >= size*2/3)
		|| (Math.abs(player.getZ() - opponent.getZ()) >= size);
}
SocketServer.checkRightCollision = function(player, opponent, size) {
	return (opponent.getX() - size > player.getX() || opponent.getX() <= player.getX())
		|| (Math.abs(player.getY() - opponent.getY()) >= size*2/3)
		|| (Math.abs(player.getZ() - opponent.getZ()) >= size);
}
SocketServer.checkUpCollision = function(player, opponent, size) {
	return (player.getY() - size*2/3 > opponent.getY() || player.getY() <= opponent.getY())
		|| (Math.abs(player.getX() - opponent.getX()) >= size)
	 	|| (Math.abs(player.getZ() - opponent.getZ()) >= size);
}
SocketServer.checkDownCollision = function(player, opponent, size) {
	return (player.getY() + size*2/3 < opponent.getY() || opponent.getY() <= player.getY())
		|| (Math.abs(player.getX() - opponent.getX()) >= size)
		|| (Math.abs(player.getZ() - opponent.getZ()) >= size);
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
		var punchInputs = SocketServer.punchInputs[sessionId];
		var input = SocketServer.processPlayerInputs(player);

		if (input !== undefined) {
			SocketServer.updatePlayerPhysics(player);
			player.setLastProcessedInput(input);
			var packet = player.toPacket();
			SocketServer.proccessedInputs[sessionId].push(packet);
		}

		if (!player.isJumping()) {
			var input = jumpInputs[0];
		    if (input !== undefined) {
		        SocketServer.executeInput(player, input);
		        jumpInputs.shift();
		    }
		}

		if (!player.isPunching()) {
			var input = punchInputs[0];
		    if (input !== undefined) {
		        SocketServer.executeInput(player, input);
		        punchInputs.shift();
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