var App;
var GlobalEvents;
var Point;
var Background;
var obj;
var socket = io();

function StageScreen() {
	App = require('../../app.js');
	GlobalEvents = require('../global-events.js');
	Point = require('../canvas/point.js');
	Background = require('../canvas/background.js');

	this.backgroundImage = new Background('./img/stage_background.png');
	obj = this;

	App.player.location = new Point(0,0);
	App.opponent.location = new Point(50, 50);
};

StageScreen.prototype.playerMove = function() {
	var key = GlobalEvents.Key;
	if (key.isDown(key.RIGHT)) {
		socket.emit('move', key.RIGHT);
	}
	if (key.isDown(key.LEFT)) {
		socket.emit('move', key.LEFT);
	}
	if (key.isDown(key.UP)) {
		socket.emit('move', key.UP);
	}
	if (key.isDown(key.DOWN)) {
		socket.emit('move', key.DOWN);
	}
};

StageScreen.prototype.graphics = function() {
	obj.backgroundImage.draw();
	obj.playerMove();
	App.player.draw();
	App.opponent.draw();
};

module.exports = StageScreen;