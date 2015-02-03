var Express = require('./express');
var Session = require('./session');
var SessionCollection = require('./session-collection');
var PlayerCollection = require('./player-collection');
var Player = require('./player');
var Point = require('../common/point');
var Collisions = require('../common/collisions');
var Config = require('./config');
var fs = require('fs');

var SocketServer = {};

SocketServer.http = require('http').Server(Express.app);

SocketServer.inputs = [];
SocketServer.proccessedInputs = [];
SocketServer.jumpInputs = [];
SocketServer.punchInputs = [];
SocketServer.kickInputs = [];
SocketServer.comboInputs = [];

SocketServer.prepareSocketData = function(player, opponent, socket) {
	var data = {
		player: {
			x: player.getX(),
			z: player.getZ(),
			punched: player.isPunched(),
			victor: player.isVictor(),
			defeated: player.isDefeated(),
			input: player.getLastProcessedInput(),
			lives: player.getLives(),
			energy: player.getEnergy()
		},
		opponent: {
			x: opponent.getX(),
			z: opponent.getZ(),
			punched: opponent.isPunched(),
			victor: opponent.isVictor(),
			defeated: opponent.isDefeated(),
			sequence: SocketServer.proccessedInputs[opponent.getID()] || [],
			lives: opponent.getLives(),
			energy: opponent.getEnergy()
		}
	};
	return data;
};

SocketServer.prepareClient = function (socket, selection) {
	if (!SessionCollection.sessionExists(socket.id)) {
		var targetSession = SessionCollection.getAvailableSession();
		SessionCollection.createSession(socket, selection);
		console.log(socket.id + ' is ready');
		if (targetSession !== undefined) {
			var session = SessionCollection.getSessionObject(socket.id);

			session.opponentId = targetSession.sessionId;
			session.state = Session.PLAYING;
			targetSession.opponentId = session.sessionId;
			targetSession.state = Session.PLAYING;

			var playerSelection = session.getSelection();
			var opponentSelection = targetSession.getSelection();

			var playerData = JSON.parse(
				fs.readFileSync(Config.charactersPath + 
					'character' + playerSelection + '.json', 'utf8'));
			var opponentData = JSON.parse(
				fs.readFileSync(Config.charactersPath + 
					'character' + opponentSelection + '.json', 'utf8'));

			var randomMap = Math.floor(Math.random() * 2) + 1;
			var mapData = JSON.parse(
				fs.readFileSync('src/server/maps/map' + randomMap +'.json', 'utf8'));

			var player = new Player({
				id: session.sessionId,
				opponentId: session.opponentId,
				location: Config.firstSpawnLocation.x,
				z: Config.firstSpawnLocation.z,
				characterData: playerData,
				characterId: playerSelection,
				map: mapData
			});
			var opponent = new Player({
				id: targetSession.sessionId,
				opponentId: targetSession.opponentId,
				location: Config.secondSpawnLocation.x,
				z: Config.secondSpawnLocation.z,
				characterData: opponentData,
				characterId: opponentSelection,
				map: mapData
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

			SocketServer.comboInputs[session.sessionId] = [];
			SocketServer.comboInputs[targetSession.sessionId] = [];

			session.socket.emit(Session.PLAYING, {
				player: {
					x: player.getX(),
					y: player.getZ(),
					data: playerData,
					energyCosts: playerData.costs,
				},
				opponent: {
					x: opponent.getX(),
					y: opponent.getZ(),
					data: opponentData,
					energyCosts: opponentData.costs,
				},
				map: mapData
			});
			targetSession.socket.emit(Session.PLAYING, {
				player: {
					x: opponent.getX(),
					y: opponent.getZ(),
					data: opponentData,
					energyCosts: playerData.costs,
				},
				opponent: {
					x: player.getX(),
					y: player.getZ(),
					data: playerData,
					energyCosts: opponentData.costs,
				},
				map: mapData
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
		delete SocketServer.comboInputs[session.sessionId];
	}
};

SocketServer.disconnectClient = function(socket, status) {
	var session = SessionCollection.getSessionObject(socket.id);
	if (session !== undefined && session.opponentId !== null) {
		var opponentSession = SessionCollection.getSessionObject(session.opponentId);
		if(status == "Victory") {
			socket.emit(Session.VICTORY);
			opponentSession.socket.emit(Session.DEFEAT);
		} else {
			opponentSession.socket.emit(Session.UNACTIVE);
		}			
	} else {
		socket.emit(Session.UNACTIVE);
	}
	SocketServer.deleteObjects(session);
	SocketServer.deleteObjects(opponentSession);
	SessionCollection.printSessions();
};

SocketServer.storeInput = function(socket, packet) {
	var session = SessionCollection.getSessionObject(socket.id);
	if (session !== undefined && SocketServer.inputs[socket.id] !== undefined) {
		SocketServer.inputs[socket.id].push(packet);
	}
	else {
		SocketServer.disconnectClient(socket, "");
	}
};

SocketServer.updateZ = function(player) {
	var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());
    var x = player.getX();
    var z = player.getZ();
    var opx = opponent.getX();
    var opz = opponent.getZ();
    var speedZ = player.getSpeedZ();

    if(z < 0 || player.isJumping()) {
		speedZ -= Config.playerAcceleration;
		z -= speedZ;
		if(z >= 0) {
			z = 0;
			speedZ = 0;
			player.setJumping(false);
		}
	};
	player.setZ(z);
	player.setSpeedZ(speedZ);
};
SocketServer.hit = function (player, damage, time, size, power, heightDifference) {
	player.useEnergy(damage);
	var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());

	var t = 0;
	var hit = 0;
	var dealingDamage = false;
	var x = player.getX();
    var opx = opponent.getX();
    var map = player.getMap();

	if(Collisions.checkPunchCollisionLeft(player, opponent, size, heightDifference)){
		hit = 1;
		opponent.setPunched(1);
	}
	if(Collisions.checkPunchCollisionRight(player, opponent, size, heightDifference)){
		hit = 2;
		opponent.setPunched(1);
	}
	if(hit) {
		opponent.dealDamage(player.getDamage(damage));
	}
	else
		player.useEnergy(damage);

	var updateH = setInterval(function () {
		t += 30;
		if (t >= time) {
			if(hit == 1){
				if(opx < map.dimensions.width - 185){
					opx += power;
					opponent.setX(opx);
					opponent.setPunched(0);
				}
			}
			else if(hit == 2){
				if(opx > map.dimensions.left - 135){
					opx -= power;
					opponent.setX(opx);
					opponent.setPunched(0);
				}
			}
			player.setHiting(false);
			clearInterval(updateH);
		}
	}, 1000/30);
};

SocketServer.executeInput = function(player, input) {
	var key = Config.keyBindings;
	var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());

	var x = player.getX();
	var z = player.getZ();
	var opz = opponent.getZ();
	var speedZ = player.getSpeedZ();
    var size = Config.playerSize;
    var map = player.getMap();

	if(input.jumpKey && !player.isJumping() && !player.isPunched()) {
		speedZ = Config.playerJumpSpeed;
		player.setSpeedZ(speedZ);
		player.setJumping(true);
		player.useEnergy('jump');
	}
	else if(input.jumpKey && player.isJumping() && !player.isPunched()) {
		var inputs = SocketServer.jumpInputs[player.getID()];
		if(inputs !== undefined) {
			inputs.push(input);
		}
	}

	if(player.isPunched() == 0){
		if(!player.isJumping()){
			if (input.kickCombo && !player.isHiting()) {
				console.log('kick combo');
				player.setHiting(true);
				SocketServer.hit(player, "kickCombo", 600, 80, 15, 60);
			}
			else if (input.kickCombo){
				var inputs = SocketServer.comboInputs[player.getID()];
				if(inputs !== undefined) {
					inputs.push(input);
				}
			}
			if (input.punchCombo && !player.isHiting()) {
				console.log('punch combo');
				player.setHiting(true);
				SocketServer.hit(player, "punchCombo",800, 65, 0, 60);
			}
			else if (input.punchCombo){
				var inputs = SocketServer.comboInputs[player.getID()];
				if(inputs !== undefined) {
					inputs.push(input);
				}
			}
			if (input.kickKey && !player.isHiting()) {
				player.setHiting(true);
				SocketServer.hit(player, "kick", 400, 80, 10, 60);
				console.log('simple kick');
			}
			else if (input.kickKey){
				var inputs = SocketServer.kickInputs[player.getID()];
				if(inputs !== undefined) {
					inputs.push(input);
				}
			}
			if(input.punchKey && !player.isHiting()) {
				player.setHiting(true);
				SocketServer.hit(player, "punch", 300, 65, 5, 60);
				console.log('simple punch');
			}
			else if(input.punchKey){
				var inputs = SocketServer.punchInputs[player.getID()];
				if(inputs !== undefined) {
					inputs.push(input);
				}
			}
		}
		if (player.isJumping() && input.punchKey) {
			console.log("Jumping and punching");
			player.setHiting(true);
			SocketServer.hit(player, "punch", 780, 65, 5, 120);
		}
		if (player.isJumping() && input.kickKey) {
			console.log("Jumping and kicking");
			player.setHiting(true);
			SocketServer.hit(player, "kick", 780, 85, 10, 120);
		}
	}
	if(!player.isHiting() && player.isPunched() == 0 || player.isJumping()) {
		if(!player.isDefending()) {
			if(input.key === key.LEFT) {
				if(x > map.dimensions.left - 135  
					&& Collisions.checkLeftCollision(player, opponent, size))
					x -= Config.playerMoveSpeed;
			}
			else if(input.key === key.RIGHT) {	 
				if(x < map.dimensions.width - 185
					&& Collisions.checkRightCollision(player, opponent, size))
					x += Config.playerMoveSpeed;
			}
		}
		if (input.key === key.DEFEND) {
			player.setDefending(true);
		} else {
			player.setDefending(false);
		}
	}
	player.setX(x);
	player.setCurrentAnimation(input.animationName);
};

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
		var comboInputs = SocketServer.comboInputs[sessionId];
		var input = SocketServer.processPlayerInputs(player);
		var opponent = PlayerCollection.getPlayerObject(player.getOpponentId());
		player.increaseEnergy();

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

		if (!player.isHiting()) {
			var input = punchInputs[0];
		    if (input !== undefined) {
		        SocketServer.executeInput(player, input);
		        punchInputs.shift();
		    }
		}

		if (!player.isHiting()) {
			var input = kickInputs[0];
			if (input !== undefined) {
				SocketServer.executeInput(player, input);
				kickInputs.shift();
			}
		}

		if (!player.isHiting()) {
			var input = comboInputs[0];
			if (input !== undefined) {
				SocketServer.executeInput(player, input);
				comboInputs.shift();
			}
		}
		if (player.getLives() <= 0) {
			player.Defeat(true);
			opponent.Victory(true);
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
				if(player.isVictor()){
					SocketServer.disconnectClient(session.socket, "Victory");
				}
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