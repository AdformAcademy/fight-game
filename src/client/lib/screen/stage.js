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
	App.player.setZ(0);
	App.opponent.setZ(0);
};

StageScreen.prototype.updatePlayers = function() {
	var activeKeys = {
		key: 0,
		jumpKey: false
	};

	var key = GlobalEvents.Key;

	if (key.isDown(key.RIGHT) && key.isDown(key.UP)) {
		console.log('UP RIGHT');
		console.log(App.player.getLocation().x + " " + App.player.getLocation().y)
		if (App.player.getLocation().x < 1365 - 30 && App.player.getLocation().y > 0) {
			activeKeys.key = key.UP_RIGHT;
		}
	}
	else if (key.isDown(key.LEFT) && key.isDown(key.UP)) {
		if (App.player.getLocation().x > 0 && App.player.getLocation().y > 0) {
			console.log('UP LEFT');
			activeKeys.key = key.UP_LEFT;
		}
	}
	else if (key.isDown(key.DOWN) && key.isDown(key.LEFT)) {
		if (App.player.getLocation().x > 0 && App.player.getLocation().y){
			console.log('DOWN LEFT');
			activeKeys.key = key.DOWN_LEFT;
		}
	}
	else if (key.isDown(key.DOWN) && key.isDown(key.RIGHT)) {
		if (App.player.getLocation().x < 1365 - 30 && App.player.getLocation().y){
			console.log('DOWN RIGHT');
			activeKeys.key = key.DOWN_RIGHT;
		}
	}
	else if (key.isDown(key.RIGHT)) {
		if (App.player.getLocation().x < 1365 - 30){
			console.log('RIGHT');
			activeKeys.key = key.RIGHT;
		}
	}
	else if (key.isDown(key.LEFT)) {
		if (App.player.getLocation().x > 0){
			console.log('LEFT');
			activeKeys.key = key.LEFT;
		}
	}
	else if (key.isDown(key.UP)) {
		if (App.player.getLocation().y > 0) {
			console.log('UP');
			activeKeys.key = key.UP;
		}
	}
	else if (key.isDown(key.DOWN)) {
		if (App.player.getLocation().y < 645 - 30) {
			console.log('DOWN');
			activeKeys.key = key.DOWN;
		}
	}

	if(key.isDown(key.JUMP_KEY)) {
		console.log('JUMP');
		activeKeys.jumpKey = true;
	}

	if(activeKeys.key != 0 || activeKeys.jumpKey){
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