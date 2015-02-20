var Tournament = require('./tournament');

var TournamentCollection = {};

TournamentCollection.tournaments = [];
TournamentCollection.updateInterval = null;

TournamentCollection.createTournament = function () {
	var tournament = new Tournament({
		id: TournamentCollection.tournaments.length,
		tournamentWaitTime: 10
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
			console.log('tournament deleted');
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
		if (!tournament.isFull() && !tournament.tournamentBegan) {
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
		if (!tournament.isFull() && !tournament.tournamentBegan) {
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

TournamentCollection.start = function () {
	TournamentCollection.updateInterval = setInterval(function () {
		var tournaments = TournamentCollection.tournaments;
		for (var i = 0; i < tournaments.length; i++) {
			var tournament = tournaments[i];
			if (tournament.isEmpty()) {
				TournamentCollection.deleteTournament(tournament.getId());
				return;
			}
		}
	}, 1000 / 10);
};

module.exports = TournamentCollection;