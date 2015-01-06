var App = require('../app');
var Config = require('./config');
var socket = io();

var Client = module.exports = function() {};

Client.inputs = [];
Client.serverData = [];
Client.inputCounter = 0;
Client.updateWorldInterval = null;
Client.isRunning = false;
Client.prediction = true;
Client.reconciliation = true;
Client.interpolation = true;
Client.opponentInputs = [];

Client.Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  UP_LEFT: 41,
  UP_RIGHT: 42,
  DOWN_LEFT: 43,
  DOWN_RIGHT: 44,
  JUMP_KEY: 88,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

Client.applyCoordinates = function(player, x, y, z) {
	var playerLocation = player.getLocation();
	playerLocation.setX(x);
	playerLocation.setY(y);
	if(z !== null){
		player.setZ(z);
	}
};

Client.applyInput = function(player, input) {
	if (!input) {
		return;
	}
	var opponent;
	if (player === App.player) {
		opponent = App.opponent;
	} else {
		opponent = App.player;
	}

	var key = Client.Key;
	var screenWidth = App.canvasObj.getWidth();
	var screenHeight = App.canvasObj.getHeight();

	var x = player.getLocation().getX();
	var y = player.getLocation().getY();
	var z = player.getZ();
	
	var size = Config.playerSize;

	if (input.key === key.UP_RIGHT) {
		if (x < screenWidth - size && y > 0) {
			if(Client.checkRightCollision(player, opponent, size))
				x += Config.playerMoveSpeed;
			if(Client.checkUpCollision(player, opponent, size))
				y -= Config.playerMoveSpeed;
		}
	}
	else if (input.key === key.UP_LEFT) {
		if (x > 0 && y > 0) {
			if(Client.checkLeftCollision(player, opponent, size))
				x -= Config.playerMoveSpeed;
			if(Client.checkUpCollision(player, opponent, size))
				y -= Config.playerMoveSpeed;
		}
	}
	else if (input.key === key.DOWN_LEFT) {
		if (x > 0 && y < screenHeight - size){
			if(Client.checkLeftCollision(player, opponent, size))
				x -= Config.playerMoveSpeed;
			if(Client.checkDownCollision(player, opponent, size))
				y += Config.playerMoveSpeed;
		}
	}
	else if (input.key === key.DOWN_RIGHT) {
		if (x < screenWidth - size && y < screenHeight - size){
			if(Client.checkRightCollision(player, opponent, size))
				x += Config.playerMoveSpeed;
			if(Client.checkDownCollision(player, opponent, size))
				y += Config.playerMoveSpeed;
		}
	}
	else if (input.key === key.RIGHT) {
		if (x < screenWidth - size){
			if(Client.checkRightCollision(player, opponent, size))
				x += Config.playerMoveSpeed;
		}
	}
	else if (input.key === key.LEFT) {
		if (x > 0){
			if(Client.checkLeftCollision(player, opponent, size))
				x -= Config.playerMoveSpeed;
		}
	}
	else if (input.key === key.UP) {
		if (y > 0) {
			if(Client.checkUpCollision(player, opponent, size))
				y -= Config.playerMoveSpeed;
		}
	}
	else if (input.key === key.DOWN) {
		if (y < screenHeight - size) {
			if(Client.checkDownCollision(player, opponent, size))
				y += Config.playerMoveSpeed;
		}
	}

	Client.applyCoordinates(player, x, y, z);
};

Client.checkLeftCollision = function(player, opponent, size) {
	var loc = player.getLocation();
	var oloc = opponent.getLocation();
	return (oloc.getX() + size < loc.getX() || loc.getX() <= oloc.getX())
		|| (Math.abs(loc.getY() - oloc.getY()) >= size/3)
		|| (Math.abs(opponent.getZ() - player.getZ()) >= size);
}
Client.checkRightCollision = function(player, opponent, size) {
	var loc = player.getLocation();
	var oloc = opponent.getLocation();
	return (oloc.getX() - size > loc.getX() || oloc.getX() <= loc.getX())
		|| (Math.abs(loc.getY() - oloc.getY()) >= size/3)
		|| (Math.abs(opponent.getZ() - player.getZ()) >= size);
}
Client.checkUpCollision = function(player, opponent, size) {
	var loc = player.getLocation();
	var oloc = opponent.getLocation();
	return (loc.getY() - size/3 > oloc.getY() || loc.getY() <= oloc.getY())
		|| (Math.abs(loc.getX() - oloc.getX()) >= size)
		|| (Math.abs(opponent.getZ() - player.getZ()) >= size);
}
Client.checkDownCollision = function(player, opponent, size) {
	var loc = player.getLocation();
	var oloc = opponent.getLocation();
	return (loc.getY() + size/3 < oloc.getY() || oloc.getY() <= loc.getY())
		|| (Math.abs(loc.getX() - oloc.getX()) >= size)
		|| (Math.abs(opponent.getZ() - player.getZ()) >= size);
}

Client.storeInput = function(input) {
	Client.inputs.push(input);
};

Client.storeServerData = function(data) {
	Client.serverData.push(data);
};

Client.interpolate = function() {
	var bufferSize = Client.opponentInputs.length;
	var opponent = App.opponent;
	if (bufferSize < 10) {
		var input = Client.opponentInputs[0];
		if (input !== undefined) {
			Client.applyCoordinates(opponent, input.x, input.y, input.z);
			opponent.getSpriteSheet().setActiveAnimation(input.currentAnimation);
			Client.opponentInputs.shift();
		}
	} else {
		var lastInput = Client.opponentInputs[bufferSize - 1];
		Client.applyCoordinates(opponent, lastInput.x, lastInput.y, lastInput.z);
		opponent.getSpriteSheet().setActiveAnimation(lastInput.currentAnimation);
		Client.opponentInputs = [];
	}
};

Client.reconciliate = function(state) {
	var j = 0;
	while (j < Client.inputs.length) {
		var input = Client.inputs[j];
		if (input.id <= state.player.input.id) {
			Client.inputs.splice(j, 1);
		} else {
			Client.applyInput(App.player, input);
			j++;
		}
	}
};

Client.processServerData = function() {
    for (var i = 0; i < Client.serverData.length; i++) {
    	var state = Client.serverData[i];
    	var x = state.player.x;
    	var y = state.player.y;
    	var ox = state.opponent.x;
    	var oy = state.opponent.y;
    	var oz = state.opponent.z;

    	Client.applyCoordinates(App.player, x, y, null);

    	if (Client.interpolation) {
    		Client.appendOpponentInputs(state.opponent.sequence);
    	} else {
    		Client.applyCoordinates(App.opponent, ox, oy, oz);
    	}    	

    	if (Client.prediction && Client.reconciliation) {
    		Client.reconciliate(state);
    	}
    }
    Client.serverData = [];
};

Client.appendOpponentInputs = function(inputs) {
	for (var i = 0; i < inputs.length; i++) {
		Client.opponentInputs.push(inputs[i]);
	}
};

Client.processInputs = function() {
	var input = {
		id: Client.inputCounter,
		key: 0,
		jumpKey: false
	};

	var key = Client.Key;
	var test = Config.playerMoveSpeed;
	var screenWidth = App.canvasObj.getWidth();
	var screenHeight = App.canvasObj.getHeight();
	var player = App.player;
	var playerLocation = player.getLocation();
	var x = player.getLocation().getX();
	var y = player.getLocation().getY();
	var z = player.getZ();
	var opponent = App.opponent;
	var opy = opponent.getLocation().getY();
	var opz = opponent.getZ();
	var size = Config.playerSize;

	if (key.isDown(key.RIGHT) && key.isDown(key.UP)) {
		if (x < screenWidth - size && y > 0) {
			input.key = key.UP_RIGHT;
		}
		else if (x < screenWidth - size) {
			input.key = key.RIGHT;
		}
		else if (y > 0){
			input.key = key.UP;
		}
	}
	else if (key.isDown(key.LEFT) && key.isDown(key.UP)) {
		if (x > 0 && y > 0) {
			input.key = key.UP_LEFT;
		}
		else if (x > 0) {
			input.key = key.LEFT;
		}
		else if (y > 0){
			input.key = key.UP;
		}
	}
	else if (key.isDown(key.DOWN) && key.isDown(key.LEFT)) {
		if (x > 0 && y < screenHeight - size){
			input.key = key.DOWN_LEFT;
		}
		else if (x > 0) {
			input.key = key.LEFT;
		}
		else if (y < screenHeight - size){
			input.key = key.DOWN;
		}
	}
	else if (key.isDown(key.DOWN) && key.isDown(key.RIGHT)) {
		if (x < screenWidth - size && y < screenHeight - size){
			input.key = key.DOWN_RIGHT;
		}
		else if (x < screenWidth - size) {
			input.key = key.RIGHT;
		}
		else if (y < screenHeight - size){
			input.key = key.DOWN;
		}
	}
	else if (key.isDown(key.RIGHT)) {
		if (x < screenWidth - size){
			input.key = key.RIGHT;
		}
	}
	else if (key.isDown(key.LEFT)) {
		if (x > 0){
			input.key = key.LEFT;
		}
	}
	else if (key.isDown(key.UP)) {
		if (y > 0) {
			input.key = key.UP;
		}
	}
	else if (key.isDown(key.DOWN)) {
		if (y < screenHeight - size) {
			input.key = key.DOWN;
		}
	}
	if(key.isDown(key.JUMP_KEY)) {
		if(!App.player.isJumping() && y + z > 0 && y - opz - opy != size) {
			player.getSpriteSheet().setActiveAnimation('jumpAnimation');
			input.jumpKey = true;
			speedZ = Config.playerJumpSpeed;
			player.setSpeedZ(speedZ);
			player.setJumpState(1);
			Client.jump();
		}
	}
	if (Client.prediction) {
		Client.applyInput(player, input);
		if (Client.reconciliation) {
			Client.storeInput(input);
		}
	}
	Client.inputCounter++;
	return input;
};

Client.sendServerUpdate = function () {
	var updatePacket = Client.processInputs();
	var animationName = App.player.getSpriteSheet().getCurrentAnimation();
	updatePacket.animationName = animationName;
	socket.emit('update', updatePacket);
};

Client.jump = function() {
	var updateZ = setInterval(function(){
		var player = App.player;
	    var opponent = App.opponent;
	    var x = player.getLocation().getX();
	    var y = player.getLocation().getY();
	    var z = player.getZ();
	    var opx = opponent.getLocation().getX();
	    var opy = opponent.getLocation().getY();
	    var opz = opponent.getZ();
	    var speedZ = player.getSpeedZ();
	    var size = Config.playerSize;

	    if(y + z <= 0){
    		z = -y;
    		speedZ = 0;
    	}
		if(Math.abs(x - opx) < size && Math.abs(y - opy) < size / 3){
			speedZ -= Config.playerAcceleration;
			z -= speedZ;
			if(z >= -(y + size - opy)){
				z = -(y + size - opy);
				speedZ = 0;
				player.getSpriteSheet().setActiveAnimation('standAnimation');
			}
		}
		else {
			speedZ -= Config.playerAcceleration;
			z -= speedZ;}
		if(z > 0){
			player.getSpriteSheet().setActiveAnimation('standAnimation');
			player.setJumpState(0);
			clearInterval(updateZ);
			z = 0;
			speedZ = 0;
		}
		player.setZ(z);
		player.setSpeedZ(speedZ);
	}, 1000/30);
};

Client.flip = function() {
	var playerSpriteSheet = App.player.getSpriteSheet();
	var opponentSpriteSheet = App.opponent.getSpriteSheet();
	var x = App.player.getLocation().getX();
	var opx = App.opponent.getLocation().getX();

	if(x < opx) {
		playerSpriteSheet.setDirection('right');
		opponentSpriteSheet.setDirection('left');
	}
	else {
		playerSpriteSheet.setDirection('left');
		opponentSpriteSheet.setDirection('right');
	}

	App.player.setSpriteSheet(playerSpriteSheet);
	App.opponent.setSpriteSheet(opponentSpriteSheet);
}

Client.update = function() {
	Client.processServerData();
	Client.sendServerUpdate();
	if (Client.interpolation) {
		Client.interpolate();
	}
	App.player.update();
	App.opponent.update();
	Client.flip();
};

Client.stop = function() {
	Client.isRunning = false;
	Client.inputs = [];
	Client.serverData = [];
	Client.opponentInputs = [];
	clearInterval(Client.updateWorldInterval);
};

Client.start = function() {
	Client.isRunning = true;
	Client.updateWorldInterval = setInterval(function() {
		Client.update();
	}, 1000 / 30);
};