var vows = require('vows');
var assert = require('assert');
var Player = require('../../../src/server/player');
var Point = require('../../../src/common/point');

var mockPlayerData = {};

var player = new Player({
	id: 'mockId',
	opponentId: 'opponentMockId',
	location: 0,
	z: 2,
	characterData: mockPlayerData
});

vows.describe('Player').addBatch({
	'player id': {
		'getter is defined': function () {
			assert.isTrue(player.getID() !== undefined);
		},
		'returns default ID': function () {
			assert.strictEqual(player.getID(), 'mockId');
		}
	},
	'opponent id': {
		'getter is defined': function () {
			assert.isTrue(player.getOpponentId() !== undefined);
		},
		'returns default ID': function () {
			assert.strictEqual(player.getOpponentId(), 'opponentMockId');
		}
	},
	'x coordinate': {
		topic: new Player({
			id: 'mockId',
			opponentId: 'opponentMockId',
			location: 0,
			z: 2,
			characterData: mockPlayerData
		}),
		'getter is defined': function (player) {
			assert.isTrue(player.getX() !== undefined);
		},
		'setter is defined': function (player) {
			assert.isTrue(player.setX !== undefined);
		},
		'returns default x coordinate': function (player) {
			assert.strictEqual(player.getX(), 0);
		},
		'sets x coordinate to 5': function (player) {
			player.setX(5);
			assert.strictEqual(player.getX(), 5);
		}
	},
	'z coordinate': {
		'getter is defined': function () {
			assert.isTrue(player.getZ() !== undefined);
		},
		'setter is defined': function () {
			assert.isTrue(player.setZ !== undefined);
		},
		'returns default z coordinate': function () {
			assert.strictEqual(player.getZ(), 2);
		},
		'sets z coordinate to 5': function () {
			player.setZ(5);
			assert.strictEqual(player.getZ(), 5);
		}
	},
	'speed Z': {
		'getter is defined': function () {
			assert.isTrue(player.getSpeedZ() !== undefined);
		},
		'setter is defined': function () {
			assert.isTrue(player.setSpeedZ !== undefined);
		},
		'returns default speedZ value': function () {
			assert.strictEqual(player.getSpeedZ(), 0);
		},
		'sets speedZ to 6': function () {
			player.setSpeedZ(6);
			assert.strictEqual(player.getSpeedZ(), 6);
		}
	},
	'jump': {
		'getter is defined': function () {
			assert.isTrue(player.isJumping() !== undefined);
		},
		'setter is defined': function () {
			assert.isTrue(player.setJumping !== undefined);
		},
		'returns default jumping value': function () {
			assert.strictEqual(player.isJumping(), false);
		},
		'sets jumping true': function () {
			player.setJumping(true);
			assert.isTrue(player.isJumping());
		}
	},
	'punch': {
		'getter is defined': function () {
			assert.isTrue(player.isPunching() !== undefined);
		},
		'setter is defined': function () {
			assert.isTrue(player.setPunching !== undefined);
		},
		'returns default punch value': function () {
			assert.strictEqual(player.isPunching(), false);
		},
		'sets punch true': function () {
			player.setPunching(true);
			assert.isTrue(player.isPunching());
		}
	},
	'defend': {
		'getter is defined': function () {
			assert.isTrue(player.isDefending() !== undefined);
		},
		'setter is defined': function () {
			assert.isTrue(player.setDefending !== undefined);
		},
		'returns default defend value': function () {
			assert.strictEqual(player.isDefending(), false);
		},
		'sets defending true': function () {
			player.setDefending(true);
			assert.isTrue(player.isDefending());
		}
	},
	'combo': {
		'getter is defined': function () {
			assert.isTrue(player.usingCombo() !== undefined);
		},
		'setter is defined': function () {
			assert.isTrue(player.setUsingCombo !== undefined);
		},
		'returns default combo value': function () {
			assert.strictEqual(player.usingCombo(), false);
		},
		'sets combo true': function () {
			player.setUsingCombo(true);
			assert.isTrue(player.usingCombo());
		}
	},
	'last processed input': {
		'getter is defined': function () {
			assert.isTrue(player.getLastProcessedInput() !== undefined);
		},
		'setter is defined': function () {
			assert.isTrue(player.setLastProcessedInput !== undefined);
		},
		'returns default last processed inputs value': function () {
			assert.strictEqual(player.getLastProcessedInput(), 0);
		},
		'sets custom last processed input': function () {
			var mockProccessedInput = {};
			player.setLastProcessedInput(mockProccessedInput);
			assert.strictEqual(player.getLastProcessedInput(), mockProccessedInput);
		}
	},
	'current animation': {
		'getter is defined': function () {
			assert.isTrue(player.getCurrentAnimation() !== undefined);
		},
		'setter is defined': function () {
			assert.isTrue(player.setCurrentAnimation !== undefined);
		},
		'returns default current animation value': function () {
			assert.isNull(player.getCurrentAnimation());
		},
		'sets custom current animation value': function () {
			var mockAnimation = 'mockAnimation';
			player.setCurrentAnimation(mockAnimation);
			assert.strictEqual(player.getCurrentAnimation(), mockAnimation);
		}
	},
	'character data': {
		'getter is defined': function () {
			assert.isTrue(player.getCharacterData() !== undefined);
		},
		'returns default character data': function () {
			assert.strictEqual(player.getCharacterData(), mockPlayerData);
		}
	},
	'packet': {
		topic: new Player({
			id: 'mockId',
			opponentId: 'opponentMockId',
			location: 0,
			z: 2,
			characterData: mockPlayerData
		}),
		'getter is defined': function (topic) {
			assert.isTrue(topic.toPacket() !== undefined);
		},
		'returns default packet values': {
			'x': function (topic) {
				assert.strictEqual(topic.toPacket().x, 0);
			},
			'z': function (topic) {
				assert.strictEqual(topic.toPacket().z, 2);
			},
			'currentAnimation': function (topic) {
				assert.strictEqual(topic.toPacket().currentAnimation, null);
			},
		}
	},
}).run();