var Session = require('./session');
var SocketServer = require('./socket-server');
var PlayerCollection = require('./player-collection');

var SessionPair = function (params) {
	this.id = params.id;
	this.firstSession = params.firstSession || null;
	this.secondSession = params.secondSession || null;
	this.tournamentId = params.tournamentId || null;
	this.initialTime = params.fightTime;
	this.fightTime = null;
	this.fightTimer = null;
	this.fighting = false;
};

SessionPair.prototype.getId = function () {
	return this.id;
};

SessionPair.prototype.setId = function (id) {
	this.id = id;
};

SessionPair.prototype.getFightTime = function () {
	return this.fightTime;
};

SessionPair.prototype.setFightTime = function (time) {
	this.fightTime = time;
};

SessionPair.prototype.getTournamentId = function () {
	return this.tournamentId;
};

SessionPair.prototype.setTournamentId = function (id) {
	this.tournamentId = id;
};

SessionPair.prototype.pairExists = function () {
	return this.firstSession && this.secondSession;
};

SessionPair.prototype.getFirstSession = function () {
	return this.firstSession;
};

SessionPair.prototype.setFirstSession = function (firstSession) {
	this.firstSession = firstSession;
};

SessionPair.prototype.getSecondSession = function () {
	return this.secondSession;
};

SessionPair.prototype.setSecondSession = function (secondSession) {
	this.secondSession = secondSession;
};

SessionPair.prototype.isFighting = function () {
	return this.fighting;
};

SessionPair.prototype.setFighting = function (fighting) {
	this.fighting = fighting;
};

SessionPair.prototype.endGameSession = function (session, message) {
	session.socket.emit('tournament-end-fight', {message: message});
};

SessionPair.prototype.emitMessage = function (session, message, color) {
	session.socket.emit('message', {
		text: message,
		color: color
	});
};

SessionPair.prototype.selectWinner = function () {
	var firstSession = this.firstSession;
	var secondSession = this.secondSession;
	if(firstSession !== null && secondSession !== null){
		var firstPlayer = PlayerCollection.getPlayerObject(firstSession.socket.id);
		var secondPlayer = PlayerCollection.getPlayerObject(secondSession.socket.id);

		var firstPlayerHealth = firstPlayer.getLives();
		var secondPlayerHealth = secondPlayer.getLives();

		if (firstPlayerHealth > secondPlayerHealth) {
			firstSession.addWonFight();
			this.endGameSession(firstSession, 'You won');
			firstSession.state = Session.TOURNAMENT;
			firstSession.opponentId = null;
			this.emitMessage(secondSession, 'You lost', '#ED1C1C');
			this.secondSession = null;
			SocketServer.deleteObjects(secondSession);
			this.fighting = false;
		} else if (firstPlayerHealth < secondPlayerHealth) {
			secondSession.addWonFight();
			this.endGameSession(secondSession, 'You won');
			secondSession.state = Session.TOURNAMENT;
			secondSession.opponentId = null;
			this.emitMessage(firstSession, 'You lost', '#ED1C1C');
			this.firstSession = this.secondSession;
			this.secondSession = null;
			SocketServer.deleteObjects(firstSession);
			this.fighting = false;
		} else {
			firstSession.addWonFight();
			this.endGameSession(firstSession, 'You won');
			firstSession.state = Session.TOURNAMENT;
			firstSession.opponentId = null;
			this.emitMessage(secondSession, 'You lost', '#ED1C1C');
			this.secondSession = null;
			SocketServer.deleteObjects(secondSession);
			this.fighting = false;
		}
	}
};

SessionPair.prototype.resetTimer = function () {
	this.fightTime = this.initialTime;
	clearInterval(this.fightTimer);
};

SessionPair.prototype.startTimer = function () {
	var self = this;
	this.fightTimer = setInterval(function () {
		self.fightTime--;
		if (self.fightTime < 1) {
			self.selectWinner();
			self.fighting = false;
			clearInterval(self.fightTimer);
		}
	}, 1000);
};

module.exports = SessionPair;