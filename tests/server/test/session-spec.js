var vows = require('vows');
var assert = require('assert');
var Session = require('../../../src/server/session.js');

var mockSocket = {
	id: 'mockId'
};
var mockOpponentId = 'mockOpponentId';
var session = new Session(mockSocket, mockOpponentId, Session.UNACTIVE);

vows.describe('Session').addBatch({
	'ready': {
		'is defined': function () {
			assert.isTrue(Session.READY !== undefined);
		},
		'default value': function () {
			assert.strictEqual(Session.READY, 'ready');
		}
	},
	'playing': {
		'is defined': function () {
			assert.isTrue(Session.PLAYING !== undefined);
		},
		'default value': function () {
			assert.strictEqual(Session.PLAYING, 'playing');
		}
	},
	'unactive': {
		'is defined': function () {
			assert.isTrue(Session.UNACTIVE !== undefined);
		},
		'default value': function () {
			assert.strictEqual(Session.UNACTIVE, 'unactive');
		}
	},
	'socket': {
		'is defined': function () {
			assert.isTrue(session.socket !== undefined);
		},
		'default value': function () {
			assert.strictEqual(session.socket, mockSocket);
		},
		'set socket to custom': function () {
			var customSocket = {
				id: 'customMockId'
			};
			session.socket = customSocket;
			assert.strictEqual(session.socket, customSocket);
		}
	},
	'session id': {
		'is defined': function () {
			assert.isTrue(session.sessionId !== undefined);
		},
		'default value': function () {
			assert.strictEqual(session.sessionId, 'mockId');
		},
		'set custom session id': function () {
			var customMockId = 'customMockId';
			session.sessionId = customMockId;
			assert.strictEqual(session.sessionId, customMockId);
		}
	},
	'opponent id': {
		'is defined': function () {
			assert.isTrue(session.opponentId !== undefined);
		},
		'default value': function () {
			assert.strictEqual(session.opponentId, mockOpponentId);
		},
		'set custom opponent id': function () {
			var customMockId = 'customOpponentId';
			session.opponentId = customMockId;
			assert.strictEqual(session.opponentId, customMockId);
		}
	},
	'state': {
		'is defined': function () {
			assert.isTrue(session.state !== undefined);
		},
		'default value': function () {
			assert.strictEqual(session.state, Session.UNACTIVE);
		},
		'set custom state': function () {
			session.state = Session.PLAYING;
			assert.strictEqual(session.state, Session.PLAYING);
		}
	},
	'toString': {
		topic: new Session(mockSocket, mockOpponentId, Session.UNACTIVE),
		'is defined': function (topic) {
			assert.isTrue(topic.toString !== undefined);
		},
		'default value': function (topic) {
			assert.strictEqual(topic.toString(), 
				'Session { sessionid=mockId, opponentId=mockOpponentId, state=unactive }');
		}
	}
}).export(module);