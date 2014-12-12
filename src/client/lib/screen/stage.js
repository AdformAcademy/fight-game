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

	App.player.location = new Point(-100, -100);
	App.opponent.location = new Point(-100, -100);
};

StageScreen.prototype.playerMove = function() {
	var key = GlobalEvents.Key;
	if (key.isDown(key.RIGHT)) {
		/*
			TODO padaryti boundaries pagal background
		*/
		if (App.player.getX() <= App.canvasObj.width() - 30) {
			console.log('RIGHT');
			socket.emit('move', key.RIGHT);
		}
	}
	if (key.isDown(key.LEFT)) {
		if (App.player.getX() > 0) {
			console.log('LEFT');
			socket.emit('move', key.LEFT);
		}
	}
	if (key.isDown(key.UP)) {
		if (App.player.getY() > 0) {
			console.log('UP');
			socket.emit('move', key.UP);
		}
	}
	if (key.isDown(key.DOWN)) {
		if (App.player.getY() <= App.canvasObj.height() - 30) {
			console.log('DOWN');
			socket.emit('move', key.DOWN);
		}
	}
};

StageScreen.prototype.updatePlayers = function() {
	console.log('socket update emit');
	socket.emit('update', '');
};

StageScreen.prototype.graphics = function() {
	obj.playerMove();
	obj.updatePlayers();
	obj.backgroundImage.draw();
	App.player.draw();
	App.opponent.draw();
};

module.exports = StageScreen;