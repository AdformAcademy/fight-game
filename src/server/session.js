function Session(socket, opponentId, state) {
	this.socket = socket;
	this.sessionId = socket.id;
	this.opponentId = opponentId;
	this.state = state;
	this.selection = 0;
	this.wonFights = 0;
};

Session.READY = 'ready';
Session.PLAYING = 'playing';
Session.UNACTIVE = 'unactive';
Session.VICTORY = 'victory';
Session.DEFEAT = 'defeat';
Session.TOURNAMENT = 'tournament';

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

Session.prototype.getSelection = function() {
	return this.selection;
};

Session.prototype.setSelection = function(selection) {
	if (typeof selection !== 'number') {
		selection = 1;
	}
	this.selection = selection;
};

Session.prototype.getWonFights = function () {
	return this.wonFights;
};

Session.prototype.addWonFight = function () {
	this.wonFights++;
};

Session.prototype.toString = function() {
	return 'Session { sessionid='+ this.socket.id +', opponentId='+ this.opponentId +', state='+ this.state +' }';
};

module.exports = Session;
