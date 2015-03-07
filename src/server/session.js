function Session(socket, opponentId, state) {
	this.socket = socket;
	this.sessionId = socket.id;
	this.opponentId = opponentId;
	this.state = state;
	this.selection = 0;
	this.wonFights = 0;
	this.player = null;
};

Session.READY = 'ready';
Session.TRAINING = 'training';
Session.PLAYING = 'playing';
Session.UNACTIVE = 'unactive';
Session.VICTORY = 'victory';
Session.DEFEAT = 'defeat';
Session.TOURNAMENT = 'tournament';
Session.TOURNAMENT_PLAYING = 'tournament-playing';

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

Session.prototype.setPlayer = function (player) {
	this.player = player;
};

Session.prototype.getPlayer = function () {
	return this.player;
};

Session.prototype.toString = function() {
	return 'Session { sessionid='+ this.socket.id +', opponentId='+ this.opponentId +', state='+ this.state +' }';
};

module.exports = Session;
