var Player;

	function PlayerCollection() {
	var Player = require('./player');
};

PlayerCollection.list = [];

PlayerCollection.getPlayerObject = function(PlayerId) {
  return PlayerCollection.list[PlayerId];
};
PlayerCollection.insertPlayer = function(PlayerId, player) {
  PlayerCollection.list[PlayerId] = player;
};

PlayerCollection.deletePlayer = function(PlayerId) {
  delete PlayerCollection.list[PlayerId];
};

module.exports = PlayerCollection;