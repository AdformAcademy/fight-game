var BaseConfig = require('../../common/base-config');

var Config = {};

Config.playerMoveSpeed = BaseConfig.playerMoveSpeed;
Config.playerAcceleration = BaseConfig.playerAcceleration;
Config.playerJumpSpeed = BaseConfig.playerJumpSpeed;
Config.playerSize = BaseConfig.playerSize;
Config.keyBindings = BaseConfig.keyBindings;
Config.charactersPath = 'src/server/characters_data/';
Config.actions = BaseConfig.actions;

Config.canvasMaskColor = '#000000';
Config.fontColor = '#cbcbcb';
Config.quickTapDuration = 300;

Config.progressBarPadding = 10;
Config.lifeBarWidthRatio = 0.47;
Config.energyBarWidthRatio = 0.2;
Config.lifeBarHeight = 31;
Config.energyBarHeight = 20;

Config.commonSoundsPath = './audio/common/';
Config.characterSoundsPath = './audio/character';

Config.controlsLayout = {
	LEFT: 'Move left',
	RIGHT: 'Move right',
	JUMP: 'Jump',
	DEFEND: 'Defend',
	KICK: 'Kick',
	PUNCH: 'Punch'
};

Config.controlsTable = {
	rowHeight: 0.13,
	columnWidth: 0.35,
	padding: 0.03,
	tableStart: 0.55,
	buttonWidth: 0.12
};

Config.keyMap = {
	16: 'Shift',
	17: 'Ctrl',
	20: 'CapsLck',
	33: 'PgUp',
	34: 'PgDn',
	35: 'End',
	36: 'Home',
	37: 'Left',
	38: 'Up',
	39: 'Right',
	40: 'Down',
	45: 'Insert',
	46: 'Delete',
	96: 'Num 0',
	97: 'Num 1',
	98: 'Num 2',
	99: 'Num 3',
	100: 'Num 4',
	101: 'Num 5',
	102: 'Num 6',
	103: 'Num 7',
	104: 'Num 8',
	105: 'Num 9',
	106: 'Num *',
	107: 'Num +',
	109: 'Num -',
	110: 'Num .',
	111: 'Num /',
	186: ';',
	187: '=',
	188: ',',
	189: '-',
	190: '.',
	191: '/',
	192: '`',
	219: '[',
	220: '\\',
	221: ']',
	222: '\''
};

module.exports = Config;