var vows = require('vows');
var assert = require('assert');
var Path = require('path');

var SocketServer = require('../../../src/server/socket-server.js');
var SessionCollection = require('../../../src/server/session-collection.js');
var Config = require('../../../src/server/config.js');

var socketMock = {
	id: 0,
	emit: function(message, data) {}
};

var targetSocketMock = {
	id: 1,
	emit: function(message, data) {}
};

Config.charactersPath = Path.resolve(Config.charactersPath) + '/';

vows.describe('SocketServer').addBatch({
	'prepare client': {
		'is defined': function () {
			assert.isTrue(SocketServer.prepareClient !== undefined);
		},
		'no other players': function() {
			SessionCollection.list = [];
			SocketServer.prepareClient(socketMock);
			var session = SessionCollection.getSessionObject(socketMock.id);
			assert.strictEqual(socketMock.id, session.sessionId);
			SessionCollection.list = [];
		},
		'one other player': function() {
			SessionCollection.list = [];
			SocketServer.prepareClient(targetSocketMock);
			SocketServer.prepareClient(socketMock);
			var session = SessionCollection.getSessionObject(socketMock.id);
			var targetSession = SessionCollection.getSessionObject(targetSocketMock.id);
			assert.isTrue(SocketServer.inputs[session.sessionId] !== undefined);
			assert.isTrue(SocketServer.inputs[targetSession.sessionId] !== undefined);
		}
	}
}).run();