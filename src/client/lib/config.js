var BaseConfig = require('../../common/base-config');

var Config = {};

Config.playerMoveSpeed = BaseConfig.playerMoveSpeed;
Config.playerAcceleration = BaseConfig.playerAcceleration;
Config.playerJumpSpeed = BaseConfig.playerJumpSpeed;
Config.playerSize = BaseConfig.playerSize;
Config.keyBindings = BaseConfig.keyBindings;

Config.canvasUpdateInterval = 30;
Config.canvasMaskColor = '#000000';
Config.quickTapDuration = 300;

module.exports = Config;