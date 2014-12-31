var Config = function() {
};

Config.port = 3000;
Config.playerMoveSpeed = 5;
Config.playerAcceleration = 2;
Config.playerJumpSpeed = 20;
Config.playerSize = 30;

Config.firstSpawnLocation = {
	x: 0,
	y: 500,
	z: 0
};

Config.secondSpawnLocation = {
	x: 100,
	y: 500,
	z: 0
};

module.exports = Config