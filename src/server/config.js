var BaseConfig = require('../common/base-config');

var Config = {};

Config.port = global.env === 'prod' ? 80 : 3000;
Config.playerMoveSpeed = BaseConfig.playerMoveSpeed;
Config.playerAcceleration = BaseConfig.playerAcceleration;
Config.playerJumpSpeed = BaseConfig.playerJumpSpeed;
Config.playerSize = BaseConfig.playerSize;
Config.keyBindings = BaseConfig.keyBindings;
Config.actions = BaseConfig.actions;

Config.screenWidth = 900;
Config.playerDefenceMultiplier = 0.2;
Config.playerEnergyIncrement = 0.1;

Config.tournamentFightTimer = 180;
Config.tournamentWaitTimer = 60;
Config.tournamentLenght = 8;

Config.firstSpawnLocation = {
	x: 590,
	z: 0
};
Config.secondSpawnLocation = {
	x: 1090,
	z: 0
};
Config.charactersPath = 'src/server/characters_data/';
Config.soundsDataFile = 'src/server/common-sound-data.json';
Config.particlesPath = 'src/server/particles_data/';
Config.particlesDataFile = 'src/server/particles-data.json';

module.exports = Config;
