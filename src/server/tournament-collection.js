var Tournament = require('./tournament');

var TournamentCollection = {};

TournamentCollection.tournaments = [];

TournamentCollection.createTournament = function () {
	var tournament = new Tournament({
		id: TournamentCollection.tournaments.length,
		tournamentWaitTime: 180
	});
	TournamentCollection.tournaments.push(tournament);
};

TournamentCollection.getTournament = function (id) {
	var tournaments = TournamentCollection.tournaments;
	for (var tournamentId in tournaments) {
		var tournament = tournaments[tournamentId];
		if (tournament.getId() === id) {
			return tournament;
		}
	}
	return undefined;
};

TournamentCollection.deleteTournament = function (id) {
	var tournaments = TournamentCollection.tournaments;
	for (var i = 0; i < tournaments.length; i++) {
		var tournament = tournaments[i];
		if (tournament.getId() === id) {
			tournament.stop();
			tournaments.splice(i, 1);
			return true;
		}
	}
	return false;
};

TournamentCollection.canJoin = function () {
	var tournaments = TournamentCollection.tournaments;
	for (var i = 0; i < tournaments.length; i++) {
		var tournament = tournaments[i];
		if (!tournament.isFull()) {
			return true;
		}
	}
	return false;
};

TournamentCollection.joinTournament = function (session) {
	if (!TournamentCollection.canJoin()) {
		this.createTournament();
	}
	var tournaments = TournamentCollection.tournaments;
	for (var i = 0; i < tournaments.length; i++) {
		var tournament = tournaments[i];
		if (!tournament.isFull()) {
			tournament.join(session);
			return true;
		}
	}
	return false;
};

TournamentCollection.disconnectSession = function (socket) {
	var tournaments = TournamentCollection.tournaments;
	for (var i = 0; i < tournaments.length; i++) {
		var tournament = tournaments[i];
		if (tournament.disconnectSession(socket) && tournament.isEmpty()) {
			TournamentCollection.deleteTournament(tournament.getId());
			return;
		}
	}
};

module.exports = TournamentCollection;