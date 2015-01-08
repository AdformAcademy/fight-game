var BaseConfig = require('../common/base-config');

var Config = function() {};

Config.port = 3000;
Config.playerMoveSpeed = BaseConfig.playerMoveSpeed;
Config.playerAcceleration = BaseConfig.playerAcceleration;
Config.playerJumpSpeed = BaseConfig.playerJumpSpeed;
Config.playerSize = BaseConfig.playerSize;
Config.firstSpawnLocation = {
	x: 0,
	y: 300,
	z: 0
};
Config.secondSpawnLocation = {
	x: 500,
	y: 300,
	z: 0
};

module.exports = Config