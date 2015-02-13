var SessionPair = function (params) {
	this.id = params.id;
	this.firstSession = params.firstSession || null;
	this.secondSession = params.secondSession || null;
	this.tournamentId = params.tournamentId || null;
	this.tournamentTime = params.tournamentTime || null;
	this.tournamentTimer = null;
	this.fighting = false;
};

SessionPair.prototype.getId = function () {
	return this.id;
};

SessionPair.prototype.setId = function (id) {
	this.id = id;
};

SessionPair.prototype.getTournamentTime = function () {
	return this.tournamentTime;
};

SessionPair.prototype.setTournamentTime = function (time) {
	this.tournamentTime = time;
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

SessionPair.prototype.setFirstSession = function (firsSession) {
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

SessionPair.prototype.startTimer = function () {
	var self = this;
	this.tournamentTimer = setInterval(function () {
		self.tournamentTime--;
		if (self.tournamentTime < 1) {
			self.fighting = false;
			clearInterval(self.tournamentTimer);
		}
	}, 1000);
};

module.exports = SessionPair;