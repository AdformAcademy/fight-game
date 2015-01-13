var BaseConfig = function() {};

BaseConfig.playerMoveSpeed = 5;
BaseConfig.playerAcceleration = 2;
BaseConfig.playerJumpSpeed = 26;
BaseConfig.playerSize = 50;

BaseConfig.keyBindings = {
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	UP_LEFT: 41,
	UP_RIGHT: 42,
	DOWN_LEFT: 43,
	DOWN_RIGHT: 44,
	JUMP: 88,
	KICK: 86,
	PUNCH: 90,
	DEFEND: 67,
	KICK: 86
};

module.exports = BaseConfig;