var Express = require('./express');
var Session = require('./session');
var SessionCollection = require('./session-collection');
var PlayerCollection = require('./player-collection');
var Player = require('./player');
var Config = require('./config');
var fs = require('fs');

var SocketServer = function() {};

SocketServer.http = require('http').Server(Express.app);

SocketServer.inputs = [];
SocketServer.proccessedInputs = [];
SocketServer.jumpInputs = [];
SocketServer.punchInputs = [];
SocketServer.kickInputs = [];

SocketServer.prepareSocketData = function(player, opponent) {
	var data = {
		player: {
			x: player.getX(),
			y: player.getY(),
			z: player.getZ(),
			punched: player.isPunched(),
			input: player.getLastProcessedInput()
		},
		opponent: {
			x: opponent.getX(),
			y: opponent.getY(),
			z: opponent.getZ(),
			punched: opponent.isPunched(), 
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

			var playerData = JSON.parse(
				fs.readFileSync(Config.charactersPath + 'character1.json', 'utf8'));
			var opponentData = JSON.parse(
				fs.readFileSync(Config.charactersPath + 'character2.json', 'utf8'));

			var player = Player({
				id: session.sessionId,
				opponentId: session.opponentId,
				x: Config.firstSpawnLocation.x,
				y: Config.firstSpawnLocation.y,
				z: Config.firstSpawnLocation.z,
				characterData: playerData
			});
			var opponent = Player({
				id: targetSession.sessionId,
				opponentId: targetSession.opponentId,
				x: Config.secondSpawnLocation.x,
				y: Config.secondSpawnLocation.y,
				z: Config.secondSpawnLocation.z,
				characterData: opponentData
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

			SocketServer.kickInputs[session.sessionId] = [];
			SocketServer.kickInputs[targetSession.sessionId] = [];

			session.socket.emit(Session.PLAYING, {
				player: {
					x: player.getX(),
					y: player.getY(),
					data: playerData.spriteSheetData
				},
				opponent: {
					x: opponent.getX(),
					y: opponent.getY(),
					data: opponentData.spriteSheetData
				}
			});
			targetSession.socket.emit(Session.PLAYING, {
				player: {
					x: opponent.getX(),
					y: opponent.getY(),
					data: opponentData.spriteSheetData
				},
				opponent: {
					x: player.getX(),
					y: player.getY(),
					data: playerData.spriteSheetData
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
		delete SocketServer.kickInputs[session.sessionId];
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

SocketServer.comboPunch = function (player) {
	var t = 0;
	var punched = 0;
	var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());
	var x = player.getX();
    var opx = opponent.getX();
    if(SocketServer.checkPunchCollisionLeft(player, opponent, 65, 60, 40)){
		punched = 1;
		opponent.setPunched(3);
	}
	if(SocketServer.checkPunchCollisionRight(player, opponent, 65, 60, 40)){
		punched = 2;
		opponent.setPunched(3);
	}
	var updateP = setInterval(function(){
		t += 30;
		if(t >= 800){
			opponent.setPunched(0);
			player.setUsingCombo(false);
			clearInterval(updateP);
		}
	}, 1000/30);
};

SocketServer.comboKick = function (player) {
	var t = 0;
	var punched = 0;
	var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());
	var x = player.getX();
    var opx = opponent.getX();
	if(SocketServer.checkPunchCollisionLeft(player, opponent, 80, 60, 40)){
		punched = 1;
		opponent.setPunched(4);
	}
	if(SocketServer.checkPunchCollisionRight(player, opponent, 80, 60, 40)){
		punched = 2;
		opponent.setPunched(4);
	}
	var updateP = setInterval(function(){
		t += 30;
		if(t >= 600){
			if(punched == 1){
				if(opx < Config.screenWidth - 185){
					opx += 15;
					opponent.setX(opx);
					opponent.setPunched(0);
				}
			}
			else if(punched == 2){
				if(opx > -135){
					opx -= 15;
					opponent.setX(opx);
					opponent.setPunched(0);
				}
			}
			opponent.setPunched(0);
			player.setUsingCombo(false);
			clearInterval(updateP);
		}
	}, 1000 / 30);
}

SocketServer.punch = function(player) {
	var t = 0;
	var punched = 0;
	var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());
	var x = player.getX();
    var opx = opponent.getX();
	var updateP = setInterval(function(){
		t += 30;
		if(SocketServer.checkPunchCollisionLeft(player, opponent, 65, 60, 40)){
			punched = 1;
			opponent.setPunched(1);
		}
		if(SocketServer.checkPunchCollisionRight(player, opponent, 65, 60, 40)){
			punched = 2;
			opponent.setPunched(1);
		}
		if (player.usingCombo()) {
			player.setPunching(false);
			clearInterval(updateP);
		}
		if(t >= 300){
			if(punched == 1){
				if(opx < Config.screenWidth - 185){
					opx += 5;
					opponent.setX(opx);
					opponent.setPunched(0);
				}
			}
			else if(punched == 2){
				if(opx > -135){
					opx -= 5;
					opponent.setX(opx);
					opponent.setPunched(0);
				}
			}
			clearInterval(updateP);
		}
	}, 1000 / 30);
	player.setPunching(false);
};

SocketServer.kick = function (player) {
	var t = 0;
	var kicked = 0;
	var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());
	var x = player.getX();
    var opx = opponent.getX();
	var updateK = setInterval(function() {
		t += 30;
		if(SocketServer.checkPunchCollisionLeft(player, opponent, 80, 60, 40)){
			kicked = 1;
			opponent.setPunched(2);
		}
		if(SocketServer.checkPunchCollisionRight(player, opponent, 80, 60, 40)){
			kicked = 2;
			opponent.setPunched(2);
		}
		if(player.usingCombo()){
			player.setKicking(false);
			clearInterval(updateK);
		}
		if(t >= 400) {
			if(kicked == 1){
				if(opx < Config.screenWidth - 185){
					opx += 10;
					opponent.setX(opx);
					opponent.setPunched(0);
				}
			}
			else if(kicked == 2){
				if(opx > -135){
					opx -= 10;
					opponent.setX(opx);
					opponent.setPunched(0);
				}
			}
			clearInterval(updateK);
			player.setKicking(false);
		}
	}, 1000/30);
	player.setKicking(false);
}

SocketServer.checkPunchCollisionLeft = function(player, opponent, size, heightDifference, yDifference) {
	return (player.getX() < opponent.getX() && opponent.getX() - player.getX() < size
		&& (Math.abs(player.getY() - opponent.getY()) <= yDifference)
		&& (Math.abs(player.getZ() - opponent.getZ()) <= heightDifference));
}

SocketServer.checkPunchCollisionRight = function(player, opponent, size, heightDifference, yDifference) {
	return (player.getX() > opponent.getX() && player.getX() - opponent.getX() < size
		&& (Math.abs(player.getY() - opponent.getY()) <= yDifference)
		&& (Math.abs(player.getZ() - opponent.getZ()) <= heightDifference));
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

	if(input.jumpKey && !player.isJumping() && y - opz - opy != Config.playerSize && !player.isPunched()) {
		speedZ = Config.playerJumpSpeed;
		player.setSpeedZ(speedZ);
		player.setJumping(true);
	}
	else if(input.jumpKey && player.isJumping() && !player.isPunched()) {
		var inputs = SocketServer.jumpInputs[player.getID()];
		if(inputs !== undefined) {
			inputs.push(input);
		}
	}

	if(!player.isKicking() && !player.isPunching() && !player.usingCombo() && player.isPunched() == 0){

		if (input.kickCombo) {
			player.setUsingCombo(true);
			SocketServer.comboKick(player);
			console.log('combo kick');
		} 
		if (input.punchCombo) {
			player.setUsingCombo(true);
			SocketServer.comboPunch(player);
			console.log('combo puch');
		}
		if(input.kickKey) {
			player.setKicking(true);
			SocketServer.kick(player);
			console.log('simple kick');
		}
		else if(input.kickKey) {
			var inputs = SocketServer.kickInputs[player.getID()];
			if(inputs !== undefined) {
				inputs.push(input);
			}
		}
		if(input.punchKey) {
			player.setPunching(true);
			SocketServer.punch(player);
			console.log('simple punch');
		}
		else if(input.punchKey) {
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
		var kickInputs = SocketServer.kickInputs[sessionId];
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

		if (!player.isKicking()) {
			var input = kickInputs[0];
			if (input !== undefined) {
				SocketServer.executeInput(player, input);
				kickInputs.shift();
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