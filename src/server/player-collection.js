function PlayerCollection() {};

PlayerCollection.list = [];

PlayerCollection.getPlayerObject = function(playerId) {
  return PlayerCollection.list[playerId];
};
PlayerCollection.insertPlayer = function(playerId, player) {
  PlayerCollection.list[playerId] = player;
};

PlayerCollection.deletePlayer = function(playerId) {
  delete PlayerCollection.list[playerId];
};

PlayerCollection.printPlayers = function() {
  console.log('Players: ');
  for (var key in PlayerCollection.list) {
    console.log(PlayerCollection.list[key]);
  }
};

module.exports = PlayerCollection;