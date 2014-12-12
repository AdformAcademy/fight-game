var App;
var GlobalEvents;
var Point;
var Background;
var obj;
var socket = io();

function StageScreen() {
	App = require('../../app');
	GlobalEvents = require('../global-events');
	Point = require('../canvas/point');
	Background = require('../canvas/background');

	this.backgroundImage = new Background('./img/stage_background.png');
	obj = this;

	App.player.setLocation(new Point(0,0));
	App.opponent.setLocation(new Point(50, 50));
};

StageScreen.prototype.updatePlayers = function() {
	var currentKey = 0;
	console.log('socket update emit');
	var key = GlobalEvents.Key;

	if (key.isDown(key.RIGHT) && key.isDown(key.UP)) {
		console.log('UP RIGHT');
		currentKey = key.UP_RIGHT;
	}
	else if (key.isDown(key.LEFT) && key.isDown(key.UP)) {
		console.log('UP LEFT');
		currentKey = key.UP_LEFT;
	}
	else if (key.isDown(key.DOWN) && key.isDown(key.LEFT)) {
		console.log('DOWN LEFT');
		currentKey = key.DOWN_LEFT;
	}
	else if (key.isDown(key.DOWN) && key.isDown(key.RIGHT)) {
		console.log('DOWN RIGHT');
		currentKey = key.DOWN_RIGHT;
	}
	else if (key.isDown(key.RIGHT)) {
		console.log('RIGHT');
		currentKey = key.RIGHT;
	}
	else if (key.isDown(key.LEFT)) {
		console.log('LEFT');
		currentKey = key.LEFT;
	}
	else if (key.isDown(key.UP)) {
		console.log('UP');
		currentKey = key.UP;
	}
	else if (key.isDown(key.DOWN)) {
		console.log('DOWN');
		currentKey = key.DOWN;
	}
	socket.emit('update', currentKey);
};

StageScreen.prototype.graphics = function() {
	obj.updatePlayers();
	obj.backgroundImage.draw();
	App.player.draw();
	App.opponent.draw();
};

module.exports = StageScreen;