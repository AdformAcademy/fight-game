function Session(sessionId, opponentId, state) {
	this.sessionId = sessionId;
	this.opponentId = opponentId;
	this.state = state;
}

Session.prototype.sessionId = function() {
	return this.sessionId;
}

Session.prototype.opponentId = function() {
	return this.opponentId;
}

Session.prototype.state = function() {
	return this.state;
}

Session.prototype.setState = function(state) {
	this.state = state;
}

Session.prototype.setOpponentId = function(opponentId) {
	this.opponentId = opponentId;
}

module.exports = Session;