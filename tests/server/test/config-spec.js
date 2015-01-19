var vows = require('vows');
var assert = require('assert');

var Config = require('../../../src/server/config.js');

vows.describe('Config').addBatch({
	'port': {
		'is defined': function () {
			assert.isTrue(Config.port !== undefined);
		}
	},
	'player move speed': {
		'is defined': function () {
			assert.isTrue(Config.playerMoveSpeed !== undefined);
		},
		'is number': function () {
			assert.isNumber(Config.playerMoveSpeed);
		},
		'is positive': function () {
			assert.isTrue(Config.playerMoveSpeed >= 0);
		}
	},
	'player acceleration': {
		'is defined': function () {
			assert.isTrue(Config.playerAcceleration !== undefined);
		},
		'is number': function () {
			assert.isNumber(Config.playerAcceleration);
		},
		'is positive': function () {
			assert.isTrue(Config.playerAcceleration >= 0);
		}
	},
	'player jump speed': {
		'is defined': function () {
			assert.isTrue(Config.playerJumpSpeed !== undefined);
		},
		'is number': function () {
			assert.isNumber(Config.playerJumpSpeed);
		},
		'is positive': function () {
			assert.isTrue(Config.playerJumpSpeed >= 0);
		}
	},
	'player size': {
		'is defined': function () {
			assert.isTrue(Config.playerSize !== undefined);
		},
		'is number': function () {
			assert.isNumber(Config.playerSize);
		},
		'is positive': function () {
			assert.isTrue(Config.playerSize >= 0);
		}
	},
	'key bindings': {
		'is defined': function () {
			assert.isTrue(Config.keyBindings !== undefined);
		}
	},
	'screen width': {
		'is defined': function () {
			assert.isTrue(Config.screenWidth !== undefined);
		},
		'is number': function () {
			assert.isNumber(Config.screenWidth);
		},
		'is positive': function () {
			assert.isTrue(Config.screenWidth >= 0);
		}
	},
	'first spawn location': {
		'is defined': function () {
			assert.isTrue(Config.firstSpawnLocation !== undefined);
		}
	},
	'second spawn location': {
		'is defined': function () {
			assert.isTrue(Config.secondSpawnLocation !== undefined);
		}
	},
	'characters path': {
		'is defined': function () {
			assert.isTrue(Config.charactersPath !== undefined);
		}
	},
}).run();