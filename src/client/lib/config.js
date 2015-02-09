var BaseConfig = require('../../common/base-config');

var Config = {};

Config.playerMoveSpeed = BaseConfig.playerMoveSpeed;
Config.playerAcceleration = BaseConfig.playerAcceleration;
Config.playerJumpSpeed = BaseConfig.playerJumpSpeed;
Config.playerSize = BaseConfig.playerSize;
Config.keyBindings = BaseConfig.keyBindings;

Config.canvasMaskColor = '#000000';
Config.quickTapDuration = 300;

Config.progressBarPadding = 10;
Config.lifeBarWidthRatio = 0.47;
Config.energyBarWidthRatio = 0.2;
Config.lifeBarHeight = 31;
Config.energyBarHeight = 20;

Config.commonSoundsPath = './audio/common/';
Config.characterSoundsPath = './audio/character';

module.exports = Config;