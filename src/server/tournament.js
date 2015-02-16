var SessionPair = require('./session-pair');
var SocketServer = require('./socket-server');
var PlayerCollection = require('./player-collection');

var Tournament = function (params) {
	this.id = params.id;
	this.sessionPairs = [];
	this.tournamentWaitTime = params.tournamentWaitTime;
	this.tournamentTimer = this.startWaitTimer();
	this.updateTimer = this.update();
	this.tournamentBegan = false;
};

Tournament.prototype.getId = function () {
	return this.id;
};

Tournament.prototype.getTournamentWaitTime = function () {
	return this.tournamentWaitTime;
};

Tournament.prototype.setTournamentWaitTime = function (time) {
	this.tournamentWaitTime = time;
};

Tournament.prototype.addSessionPair = function (sessionPair) {
	this.sessionPairs.push(sessionPair);
};

Tournament.prototype.getSessionPairs = function () {
	return this.sessionPairs;
};

Tournament.prototype.deleteSessionPair = function (pairId) {
	for (var i = 0; i < this.sessionPairs.length; i++) {
		var sessionPair = this.sessionPairs[i];
		if (sessionPair.getId() === pairId) {
			this.sessionPairs.splice(i, 1);
			return true;
		}
	}
	return false;
};

Tournament.prototype.startWaitTimer = function () {
	var self = this;
	var waitTimer = setInterval(function () {
		self.tournamentWaitTime--;
		if (self.tournamentWaitTime < 1) {
			self.begin();
			tournamentBegan = true;
			clearInterval(waitTimer);
		}
	}, 1000);

	return waitTimer;
};

Tournament.prototype.isFull = function () {
	return this.sessionPairs.length === 8;
};

Tournament.prototype.begin = function () {
	var unpickedPair;
	this.selectPairs();
	if ((unpickedPair = this.removeUnpickedPair()) !== undefined) {
		var session = unpickedPair.getFirstSession();
		SocketServer.disconnectClient(session.socket);
	}
};

Tournament.prototype.join = function (session) {
	var sessionPair = new SessionPair({
		id: this.sessionPairs.length,
		firstSession: session,
		tournamentId: this.id
	});

	this.sessionPairs.push(sessionPair);

	if (this.isFull()) {
		this.begin();
	}
};

Tournament.prototype.prepareSessionPair = function (sessionPair) {
	var firstSession = sessionPair.getFirstSession();
	var secondSession = sessionPair.getSecondSession();

	firstSession.opponentId = secondSession.sessionId;
	firstSession.state = Session.PLAYING;
	secondSession.opponentId = firstSession.sessionId;
	secondSession.state = Session.PLAYING;

	var playerSelection = firstSession.getSelection();
	var opponentSelection = secondSession.getSelection();

	var playerData = JSON.parse(
		fs.readFileSync(Config.charactersPath + 
			'character' + playerSelection + '.json', 'utf8'));
	var opponentData = JSON.parse(
		fs.readFileSync(Config.charactersPath + 
			'character' + opponentSelection + '.json', 'utf8'));

	var randomMap = Math.floor(Math.random() * 3) + 1;
	var mapData = JSON.parse(
		fs.readFileSync('src/server/maps/map' + randomMap +'.json', 'utf8'));
	var commonSoundsData = JSON.parse(
		fs.readFileSync(Config.soundsDataFile, 'utf8'));

	var player = new Player({
		id: firstSession.sessionId,
		opponentId: firstSession.opponentId,
		location: Config.firstSpawnLocation.x,
		z: Config.firstSpawnLocation.z,
		characterData: playerData,
		characterId: playerSelection,
		map: mapData
	});

	var opponent = new Player({
		id: secondSession.sessionId,
		opponentId: secondSession.opponentId,
		location: Config.secondSpawnLocation.x,
		z: Config.secondSpawnLocation.z,
		characterData: opponentData,
		characterId: opponentSelection,
		map: mapData
	});

	PlayerCollection.insertPlayer(firstSession.sessionId, player);
	PlayerCollection.insertPlayer(secondSession.sessionId, opponent);

	SocketServer.inputs[firstSession.sessionId] = [];
	SocketServer.inputs[secondSession.sessionId] = [];

	SocketServer.proccessedInputs[firstSession.sessionId] = [];
	SocketServer.proccessedInputs[secondSession.sessionId] = [];

	SocketServer.jumpInputs[firstSession.sessionId] = [];
	SocketServer.jumpInputs[secondSession.sessionId] = [];

	SocketServer.punchInputs[firstSession.sessionId] = [];
	SocketServer.punchInputs[secondSession.sessionId] = [];

	SocketServer.kickInputs[firstSession.sessionId] = [];
	SocketServer.kickInputs[secondSession.sessionId] = [];

	SocketServer.comboInputs[firstSession.sessionId] = [];
	SocketServer.comboInputs[secondSession.sessionId] = [];

	sessionPair.setFighting(true);
	sessionPair.startTimer(); // TODO start timer when both players is ready

	firstSession.socket.emit(Session.PLAYING, {
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
		map: mapData,
		soundsData: commonSoundsData
	});

	secondSession.socket.emit(Session.PLAYING, {
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
		map: mapData,
		soundsData: commonSoundsData
	});
};

Tournament.prototype.prepareSessionPairs = function () {
	var sessionPairs = this.sessionPairs;
	for (var i = 0; i < sessionPairs.length; i++) {
		var sessionPair = sessionPairs[i];
		this.prepareSessionPair(sessionPair);
	}
};

Tournament.prototype.removeUnpickedPair = function () {
	var sessionPairs = this.sessionPairs;
	for (var i = 0; i < sessionPairs.length; i++) {
		var sessionPair = sessionPairs[i];
		if (!sessionPair.pairExists()) {
			var session = sessionPair.getFirstSession();
			this.deleteSessionPair(sessionPair.getId());	
			return sessionPair;
		}
	}
	return undefined;
};

Tournament.prototype.selectPair = function (unpickedPair) {
	var sessionPairs = this.sessionPairs;
	var unpickedPairs = [];

	for (var i = 0; i < sessionPairs.length; i++) {
		var sessionPair = sessionPairs[i];
		if (!sessionPair.pairExists() && sessionPair.getId() !== unpickedPair.getId()) {
			unpickedPairs.push(sessionPair);
		}
	}

	if (unpickedPairs.length > 0) {
		var randomPair = Math.floor(Math.random() * unpickedPairs.length);
		unpickedPairs[randomPair].setSecondSession(unpickedPair.getFirstSession());
		this.deleteSessionPair(unpickedPair.getId());
		return true;
	}

	return false;
};

Tournament.prototype.selectPairs = function () {
	var existsUnpickedPairs = true;
	while (existsUnpickedPairs) {
		existsUnpickedPairs = false;
		for (var i = 0; i < this.sessionPairs.length; i++) {
			var sessionPair = this.sessionPairs[i];
			if (!sessionPair.pairExists()) {
				var picked = this.selectPair(sessionPair);
				if (picked) {
					existsUnpickedPairs = true;
					break;
				}
			}
		}
	}

};

Tournament.prototype.updateSession = function (session) {
	if (session !== null) {
		session.socket.emit('tournament-waiting', {
			timer: this.tournamentWaitTime,
			pairs: this.sessionPairs.length
		});
	}
};

Tournament.prototype.updateSessionPair = function (sessionPair) {
	var firstSession = sessionPair.getFirstSession();
	var secondSession = sessionPair.getSecondSession();

	this.updateSession(firstSession);
	this.updateSession(secondSession);
};

Tournament.prototype.updateSessions = function () {
	var sessionPairs = this.sessionPairs;
	for (var i = 0; i < sessionPairs.length; i++) {
		var sessionPair = sessionPairs[i];
		if (!sessionPair.isFighting()) {
			this.updateSessionPair(sessionPair);
		}
	}
};

Tournament.prototype.endGameSession = function (sessions) {
	session.socket.emit('tournament-disconnect-waiting', '');
};

Tournament.prototype.disconnectSession = function (socket) {
	var sessionPairs = this.sessionPairs;
	for (var i = 0; i < sessionPairs.length; i++) {
		var sessionPair = sessionPairs[i];
		var firstSession = sessionPair.getFirstSession();
		var secondSession = sessionPair.getSecondSession();

		if (firstSession !== null && firstSession.sessionId === socket.id) {

			if (!this.tournamentBegan) {
				this.sessionPairs.splice(i, 1);
				return true;
			}

			if (secondSession !== null) {
				secondSession.addWonFight();
				sessionPair.setFirstSession(secondSession);
				sessionPair.setSecondSession(null);
				this.endGameSession(secondSession);
			} else {
				sessionPair.setFirstSession(null);
			}
			sessionPair.setFighting(false);
			return true;
		} else if (secondSession !== null && secondSession.sessionId === socket.id) {
			if (firstSession !== null) {
				firstSession.addWonFight();
				this.endGameSession(firstSession);
			}
			sessionPair.setSecondSession(null);
			sessionPair.setFighting(false);
			return true;
		}
	}
	return false;
};

Tournament.prototype.isEmpty = function () {
	var sessionPairs = this.sessionPairs;
	for (var i = 0; i < sessionPairs.length; i++) {
		var sessionPair = sessionPairs[i];
		var firstSession = sessionPair.getFirstSession();
		var secondSession = sessionPair.getSecondSession();
		if (firstSession !== null || secondSession !== null) {
			return false;
		}
	}
	return true;
};

Tournament.prototype.update = function () {
	var self = this;
	var updateTimer = setInterval(function () {
		self.updateSessions();
	}, 1000 / 30);
	return updateTimer;
};

Tournament.prototype.stop = function () {
	clearInterval(this.updateTimer);
	clearInterval(this.tournamentTimer);
};

module.exports = Tournament;