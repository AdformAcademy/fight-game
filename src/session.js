function Session(socket, opponentId, state) {
	this.socket = socket;
	this.opponentId = opponentId;
	this.state = state;
}

Session.prototype.socket = function() {
	return this.socket;
}

Session.prototype.sessionId = function() {
	return this.socket.id;
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

Session.prototype.toString = function() {
	return 'Session { sessionid='+ this.socket.id +', opponentId='+ this.opponentId +', state='+ this.state +' }';
}

module.exports = Session;