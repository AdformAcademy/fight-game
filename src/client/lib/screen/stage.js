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
	App.player.setZ(0);
	App.opponent.setLocation(new Point(50, 50));
	App.opponent.setZ(0);
};

StageScreen.prototype.updatePlayers = function() {
	var activeKeys = {
		key: 0,
		space: false
	};
	var key = GlobalEvents.Key;

	if(key.isDown(key.SPACE)) {
		console.log('SPACE');
		activeKeys.space = true;
	}
	if (key.isDown(key.RIGHT) && key.isDown(key.UP)) {
		console.log('UP RIGHT');
		activeKeys.key = key.UP_RIGHT;
	}
	else if (key.isDown(key.LEFT) && key.isDown(key.UP)) {
		console.log('UP LEFT');
		activeKeys.key = key.UP_LEFT;
	}
	else if (key.isDown(key.DOWN) && key.isDown(key.LEFT)) {
		console.log('DOWN LEFT');
		activeKeys.key = key.DOWN_LEFT;
	}
	else if (key.isDown(key.DOWN) && key.isDown(key.RIGHT)) {
		console.log('DOWN RIGHT');
		activeKeys.key = key.DOWN_RIGHT;
	}
	else if (key.isDown(key.RIGHT)) {
		console.log('RIGHT');
		activeKeys.key = key.RIGHT;
	}
	else if (key.isDown(key.LEFT)) {
		console.log('LEFT');
		activeKeys.key = key.LEFT;
	}
	else if (key.isDown(key.UP)) {
		console.log('UP');
		activeKeys.key = key.UP;
	}
	else if (key.isDown(key.DOWN)) {
		console.log('DOWN');
		activeKeys.key = key.DOWN;
	}
	if(activeKeys.key != 0 || activeKeys.space){
		socket.emit('update', activeKeys);
	}
};

StageScreen.prototype.graphics = function() {
	obj.updatePlayers();
	obj.backgroundImage.draw();
	App.player.draw();
	App.opponent.draw();
};

module.exports = StageScreen;