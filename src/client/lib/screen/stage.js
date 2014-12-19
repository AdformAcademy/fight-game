var App;
var GlobalEvents;
var Point;
var Background;
var obj;
var socket = io();
var Config = require('../config');

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

StageScreen.prototype.updateMovement = function() {
	var activeKeys = {
		key: 0,
		jumpKey: false
	};

	var key = GlobalEvents.Key;
	var screenWidth = App.canvasObj.getWidth();
	var screenHeight = App.canvasObj.getHeight();
	var player = App.player;
	var x = player.getLocation().getX();
	var y = player.getLocation().getY();
	var z = player.getZ();

	if (key.isDown(key.RIGHT) && key.isDown(key.UP)) {
		console.log('UP RIGHT');
		console.log(x + " " + y)
		if (x < screenWidth - 30 && y > 0) {
			activeKeys.key = key.UP_RIGHT;
			player.getLocation().setX(x + 5);
			player.getLocation().setY(y - 5);
		}
	}
	else if (key.isDown(key.LEFT) && key.isDown(key.UP)) {
		if (x > 0 && y > 0) {
			console.log('UP LEFT');
			activeKeys.key = key.UP_LEFT;
			player.getLocation().setX(x - 5);
			player.getLocation().setY(y - 5);
		}
	}
	else if (key.isDown(key.DOWN) && key.isDown(key.LEFT)) {
		if (x > 0 && y < screenHeight - 30){
			console.log('DOWN LEFT');
			activeKeys.key = key.DOWN_LEFT;
			player.getLocation().setX(x - 5);
			player.getLocation().setY(y + 5);
		}
	}
	else if (key.isDown(key.DOWN) && key.isDown(key.RIGHT)) {
		if (x < screenWidth - 30 && y < screenHeight - 30){
			console.log('DOWN RIGHT');
			activeKeys.key = key.DOWN_RIGHT;
			player.getLocation().setX(x + 5);
			player.getLocation().setY(y + 5);
		}
	}
	else if (key.isDown(key.RIGHT)) {
		if (x < screenWidth - 30){
			console.log('RIGHT');
			activeKeys.key = key.RIGHT;
			player.getLocation().setX(x + 5);
		}
	}
	else if (key.isDown(key.LEFT)) {
		if (x > 0){
			console.log('LEFT');
			activeKeys.key = key.LEFT;
			player.getLocation().setX(x - 5);

		}
	}
	else if (key.isDown(key.UP)) {
		if (y > 0) {
			console.log('UP');
			activeKeys.key = key.UP;
			player.getLocation().setY(y - 5);
		}
	}
	else if (key.isDown(key.DOWN)) {
		if (y < screenHeight - 30) {
			console.log('DOWN');
			activeKeys.key = key.DOWN;
			player.getLocation().setY(y + 5);
		}
	}
	if(key.isDown(key.JUMP_KEY)) {
		if(!App.player.isJumping()){
		console.log('JUMP');
		activeKeys.jumpKey = true;
		speedZ = Config.playerJumpSpeed;
		z -= speedZ;
		player.setSpeedZ(speedZ);
		player.setZ(z);
		player.setJumpState(1);
	}
	}
	if(activeKeys.key != 0 || activeKeys.jumpKey){
		socket.emit('update', activeKeys);
	}
};

StageScreen.prototype.dojump = function() {
	var player = App.player;
	var opponent = App.opponent;
	var x = player.getLocation().getX();
	var y = player.getLocation().getY();
	var z = player.getZ();
	var opx = opponent.getLocation().getX();
	var opy = opponent.getLocation().getY();
	var speedZ = player.getSpeedZ();

	if(z <= 0){
		console.log(z);
		if(Math.abs(x - opx) < Config.playerSize && Math.abs(y - opy) < Config.playerSize / 3){
				console.log(Math.abs(x - opx));
				speedZ -= Config.playerAcceleration;
				z -= speedZ;
				if(opz - z < Config.playerSize){
					z = Math.abs(y - opy) - Config.playerSize;
					speedZ = 0;
				}
			}
			else {
				speedZ -= Config.playerAcceleration;
				z -= speedZ;}
			if(z > 0){
				player.setJumpState(0);
				z = 0;
				speedZ = 0;
			}
			player.setZ(z);
			player.setSpeedZ(speedZ);
	}
};


StageScreen.prototype.updatePhysics = function(){
	if(App.player.isJumping()){
		console.log('do jump');
		obj.dojump();
	}
}


StageScreen.prototype.graphics = function() {
	obj.updateMovement();
	obj.updatePhysics();
	obj.backgroundImage.draw();
	App.player.draw();
	App.opponent.draw();
};

module.exports = StageScreen;