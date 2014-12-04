function Session(socket, opponentId, state) {
	this.socket = socket;
	this.sessionId = socket.id;
	this.opponentId = opponentId;
	this.state = state;
};

Session.READY = 'ready';
Session.PLAYING = 'playing';
Session.UNACTIVE = 'unactive';

Session.prototype.socket = function() {
	return this.socket;
};

Session.prototype.sessionId = function() {
	return this.sessionid;
};

Session.prototype.opponentId = function() {
	return this.opponentId;
};

Session.prototype.state = function() {
	return this.state;
};

Session.prototype.toString = function() {
	return 'Session { sessionid='+ this.socket.id +', opponentId='+ this.opponentId +', state='+ this.state +' }';
};

module.exports = Session;