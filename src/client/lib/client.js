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
  KICK_KEY: 86,
  JUMP_KEY: 88,
  PUNCH_KEY: 90,
  
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

	var x = player.getLocation().getX();
	var y = player.getLocation().getY();
	var z = player.getZ();

	if (input.key === key.UP_RIGHT) {
		x += Config.playerMoveSpeed;
		y -= Config.playerMoveSpeed;
	}
	else if (input.key === key.UP_LEFT) {
		x -= Config.playerMoveSpeed;
		y -= Config.playerMoveSpeed;
	}
	else if (input.key === key.DOWN_LEFT) {
		x -= Config.playerMoveSpeed;
		y += Config.playerMoveSpeed;
	}
	else if (input.key === key.DOWN_RIGHT) {
		x += Config.playerMoveSpeed;
		y += Config.playerMoveSpeed;
	}
	else if (input.key === key.RIGHT) {
		x += Config.playerMoveSpeed;
	}
	else if (input.key === key.LEFT) {
		x -= Config.playerMoveSpeed;
	}
	else if (input.key === key.UP) {
		y -= Config.playerMoveSpeed;
	}
	else if (input.key === key.DOWN) {
		y += Config.playerMoveSpeed;
	}

	Client.applyCoordinates(player, x, y, z);
};

Client.checkLeftCollision = function(player, opponent, size) {
	var loc = player.getLocation();
	var oloc = opponent.getLocation();
	return (oloc.getX() + size < loc.getX() || loc.getX() <= oloc.getX())
		|| (Math.abs(loc.getY() - oloc.getY()) >= size*2/3)
		|| (Math.abs(opponent.getZ() - player.getZ()) >= size);
}
Client.checkRightCollision = function(player, opponent, size) {
	var loc = player.getLocation();
	var oloc = opponent.getLocation();
	return (oloc.getX() - size > loc.getX() || oloc.getX() <= loc.getX())
		|| (Math.abs(loc.getY() - oloc.getY()) >= size*2/3)
		|| (Math.abs(opponent.getZ() - player.getZ()) >= size);
}
Client.checkUpCollision = function(player, opponent, size) {
	var loc = player.getLocation();
	var oloc = opponent.getLocation();
	return (loc.getY() - size*2/3 > oloc.getY() || loc.getY() <= oloc.getY())
		|| (Math.abs(loc.getX() - oloc.getX()) >= size)
		|| (Math.abs(opponent.getZ() - player.getZ()) >= size);
}
Client.checkDownCollision = function(player, opponent, size) {
	var loc = player.getLocation();
	var oloc = opponent.getLocation();
	return (loc.getY() + size*2/3 < oloc.getY() || oloc.getY() <= loc.getY())
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
	var playerSprite = player.getSpriteSheet();
	var playerLocation = player.getLocation();
	var x = player.getLocation().getX();
	var y = player.getLocation().getY();
	var z = player.getZ();
	var opponent = App.opponent;
	var opy = opponent.getLocation().getY();
	var opz = opponent.getZ();
	var size = Config.playerSize;

	if (key.isDown(key.RIGHT) && key.isDown(key.UP) && !player.isPunching() && !player.isKicking()) {
		if (x < screenWidth - 185 && y > 150 && Client.checkRightCollision(player, opponent, size) && Client.checkUpCollision(player, opponent, size)) {
			input.key = key.UP_RIGHT;
		}
		else if (x < screenWidth - 185 && Client.checkRightCollision(player, opponent, size)) {
			input.key = key.RIGHT;
		}
		else if (y > 150 && Client.checkUpCollision(player, opponent, size)){
			input.key = key.UP;
		}
	}
	else if (key.isDown(key.LEFT) && key.isDown(key.UP) && !player.isPunching() && !player.isKicking()) {
		if (x > -135 && y > 150 && Client.checkLeftCollision(player, opponent, size) && Client.checkUpCollision(player, opponent, size)) {
			input.key = key.UP_LEFT;
		}
		else if (x > -135 && Client.checkLeftCollision(player, opponent, size)) {
			input.key = key.LEFT;
		}
		else if (y > 150 && Client.checkUpCollision(player, opponent, size)){
			input.key = key.UP;
		}
	}
	else if (key.isDown(key.DOWN) && key.isDown(key.LEFT) && !player.isPunching() && !player.isKicking()) {
		if (x > -135 && y < screenHeight - 200 && Client.checkLeftCollision(player, opponent, size) && Client.checkDownCollision(player, opponent, size)){
			input.key = key.DOWN_LEFT;
		}
		else if (x > -135 && Client.checkLeftCollision(player, opponent, size)) {
			input.key = key.LEFT;
		}
		else if (y < screenHeight - 200 && Client.checkDownCollision(player, opponent, size)){
			input.key = key.DOWN;
		}
	}
	else if (key.isDown(key.DOWN) && key.isDown(key.RIGHT) && !player.isPunching() && !player.isKicking()) {
		if (x < screenWidth - 185 && y < screenHeight - 200 && Client.checkRightCollision(player, opponent, size) && Client.checkDownCollision(player, opponent, size)){
			input.key = key.DOWN_RIGHT;
		}
		else if (x < screenWidth - 185 && Client.checkRightCollision(player, opponent, size)) {
			input.key = key.RIGHT;
		}
		else if (y < screenHeight - 200 && Client.checkDownCollision(player, opponent, size)){
			input.key = key.DOWN;
		}
	}
	else if (key.isDown(key.RIGHT) && !player.isPunching() && !player.isKicking()) {
		if (x < screenWidth - 185){
			if(Client.checkRightCollision(player, opponent, size))
				input.key = key.RIGHT;
		}
	}
	else if (key.isDown(key.LEFT) && !player.isPunching() && !player.isKicking()) {
		if (x > -135){
			if(Client.checkLeftCollision(player, opponent, size))
				input.key = key.LEFT;
		}
	}
	else if (key.isDown(key.UP) && !player.isPunching() && !player.isKicking()) {
		if (y > 150) {
			if(Client.checkUpCollision(player, opponent, size))
				input.key = key.UP;
		}
	}
	else if (key.isDown(key.DOWN) && !player.isPunching() && !player.isKicking()) {
		if (y < screenHeight - 200) {
			if(Client.checkDownCollision(player, opponent, size))
				input.key = key.DOWN;
		}
	}

	if (input.key !== 0 && !player.isJumping() && !player.isPunching() && !player.isKicking()) {
		playerSprite.setActiveAnimation('moveAnimation');
	} else if (input.key === 0 && !player.isJumping() && !player.isPunching() && !player.isKicking()) {
		playerSprite.setActiveAnimation('standAnimation');
	}

	if(key.isDown(key.JUMP_KEY)) {
		if(!player.isJumping() && y + z > 0 && y - opz - opy != size) {
			playerSprite.setActiveAnimation('jumpAnimation');
			input.jumpKey = true;
			speedZ = Config.playerJumpSpeed;
			player.setSpeedZ(speedZ);
			player.setJumpState(1);
			Client.jump();
		}
	}

	if(key.isDown(key.PUNCH_KEY)) {
		if(!player.isPunching()) {
			var punchNumber = Math.ceil(Math.random() * 2);
			playerSprite.setActiveAnimation('punchAnimation' + punchNumber);
			player.setPunchState(1);
			Client.punch();
		}
	}

	if(key.isDown(key.KICK_KEY)) {
		if(!player.isKicking()) {
			var kickNumber = Math.ceil(Math.random() * 2);
			playerSprite.setActiveAnimation('kickAnimation');
			player.setKickState(1);
			Client.kick();
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

Client.punch = function() {
	var t = 0;
	var updateP = setInterval(function(){
		var player = App.player;
		t += 30;
		if(t >= 400){
			player.getSpriteSheet().setActiveAnimation('standAnimation');
			player.setPunchState(0);
			clearInterval(updateP);
		}
	}, 1000/30);
};

Client.kick = function() {
	var t = 0;
	var updateP = setInterval(function(){
		var player = App.player;
		t += 30;
		if(t >= 400){
			player.getSpriteSheet().setActiveAnimation('standAnimation');
			player.setKickState(0);
			clearInterval(updateP);
		}
	}, 1000/30);
};

Client.flip = function() {
	var playerSpriteSheet = App.player.getSpriteSheet();
	var opponentSpriteSheet = App.opponent.getSpriteSheet();
	var x = App.player.getLocation().getX();
	var opx = App.opponent.getLocation().getX();

	if(x < opx) {
		playerSpriteSheet.flipAnimation(true);
		opponentSpriteSheet.flipAnimation(false);
	}
	else {
		playerSpriteSheet.flipAnimation(false);
		opponentSpriteSheet.flipAnimation(true);
	}

	App.player.setSpriteSheet(playerSpriteSheet);
	App.opponent.setSpriteSheet(opponentSpriteSheet);
};

Client.updatePlayersDepth = function () {
	var player = App.player;
	var opponent = App.opponent;
	var y = player.getLocation().getY();
	var z = player.getZ();
	var oy = opponent.getLocation().getY();
	var oz = opponent.getZ();

	if (y > oy) {
		player.setDepth(0);
		opponent.setDepth(1);
	} else {
		player.setDepth(1);
		opponent.setDepth(0);
	}
};

Client.update = function() {
	Client.processServerData();
	Client.sendServerUpdate();
	if (Client.interpolation) {
		Client.interpolate();
	}
	App.player.update();
	App.opponent.update();
	Client.flip();
	Client.updatePlayersDepth();
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