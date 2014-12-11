var Player;

	function PlayerCollection() {
	var Player = require('./player');
};

PlayerCollection.list = [];

PlayerCollection.getPlayerObject = function(PlayerId) {
  return PlayerCollection.list[PlayerId];
};
PlayerCollection.insertPlayer = function(PlayerId) {
  var playerObj = new Player(PlayerId, null, 0, 0);				//
  PlayerCollection.list[socket.id] = playerObj;
};

PlayerCollection.deletePlayer = function(PlayerId) {
  delete PlayerCollection.list[PlayerId];
};

module.exports = PlayerCollection;