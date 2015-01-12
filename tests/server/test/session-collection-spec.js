var vows = require('vows');
var assert = require('assert');
var SessionCollection = require('../../../src/server/session-collection.js');
var Session = require('../../../src/server/session.js');

var mockSessionId = 'mockId';
var mockSocket = {
	id: mockSessionId
};

vows.describe('Session collection').addBatch({
	'properties': {
		'list': {
			'is defined': function () {
				assert.isTrue(SessionCollection.list !== undefined);
			},
			'is array': function () {
				assert.isArray(SessionCollection.list);
			}
		},
		'get session object': {
			'is defined': function () {
				assert.isTrue(SessionCollection.getSessionObject !== undefined);
			}
		},
		'get available session': {
			'is defined': function () {
				assert.isTrue(SessionCollection.getAvailableSession !== undefined);
			}
		},
		'session exists': {
			'is defined': function () {
				assert.isTrue(SessionCollection.sessionExists !== undefined);
			}
		},
		'create session': {
			'is defined': function () {
				assert.isTrue(SessionCollection.createSession !== undefined);
			}
		},
		'delete session': {
			'is defined': function () {
				assert.isTrue(SessionCollection.deleteSession !== undefined);
			}
		},
		'print sessions': {
			'is defined': function () {
				assert.isTrue(SessionCollection.printSessions !== undefined);
			}
		},
		'get collection': {
			'is defined': function () {
				assert.isTrue(SessionCollection.getCollection !== undefined);
			}
		},
	},
	'session create': {
		'get created session': function () {
			SessionCollection.list = [];
			SessionCollection.createSession(mockSocket);
			var session = SessionCollection.getSessionObject(mockSessionId);
			assert.strictEqual(session.sessionId, mockSessionId);
		}
	},
	'session delete': {
		'delete created session': function () {
			SessionCollection.list = [];
			SessionCollection.createSession(mockSocket);
			SessionCollection.deleteSession(mockSessionId);
			var session = SessionCollection.getSessionObject(mockSessionId);
			assert.isUndefined(session);
		}
	},
	'available session': {
		'should get available session': function () {
			SessionCollection.list = [];
			SessionCollection.createSession(mockSocket);
			var session = SessionCollection.getAvailableSession();
			assert.instanceOf(session, Session);
		}
	},
	'session existence': {
		'created session should exists': function () {
			SessionCollection.list = [];
			SessionCollection.createSession(mockSocket);
			var exists = SessionCollection.sessionExists(mockSessionId);
			assert.isTrue(exists);
		}
	},
	'session collection': {
		'is array': function () {
			var collection = SessionCollection.getCollection();
			assert.isArray(collection);
		}
	}
}).run();