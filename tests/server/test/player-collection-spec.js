var vows = require('vows');
var assert = require('assert');
var PlayerCollection = require('../../../src/server/player-collection.js');

var mockPlayer = {};
var mockPlayerId = 'mockId';

vows.describe('Player collection').addBatch({
	'properties': {
		'list': {
			'is defined': function () {
				assert.isTrue(PlayerCollection.list !== undefined);
			},
			'is array': function () {
				assert.isArray(PlayerCollection.list);
			}
		},
		'get player object': {
			'is defined': function () {
				assert.isTrue(PlayerCollection.getPlayerObject !== undefined);
			}
		},
		'insert player': {
			'is defined': function () {
				assert.isTrue(PlayerCollection.insertPlayer !== undefined);
			}
		},
		'delete player': {
			'is defined': function () {
				assert.isTrue(PlayerCollection.deletePlayer !== undefined);
			}
		},
		'print players': {
			'is defined': function () {
				assert.isTrue(PlayerCollection.printPlayers !== undefined);
			}
		},
	},
	'player insert': {
		'get inserted player': function () {
			PlayerCollection.insertPlayer(mockPlayerId, mockPlayer);
			var player = PlayerCollection.getPlayerObject(mockPlayerId);
			assert.strictEqual(player, mockPlayer);
		}
	},
	'player delete': {
		'delete inserted player': function () {
			PlayerCollection.deletePlayer(mockPlayerId);
			var player = PlayerCollection.getPlayerObject(mockPlayerId);
			assert.isUndefined(player);
		}
	},
}).export(module);