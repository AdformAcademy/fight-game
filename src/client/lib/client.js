var App = require('../app');
var Config = require('./config');
var InputCollection = require('./input-collection');
var InputProcessor = require('./input-processor');
var socket = io();

var Client = module.exports = {};

Client.inputs = [];
Client.serverData = [];
Client.inputCounter = 0;
Client.updateWorldInterval = null;
Client.isRunning = false;
Client.prediction = true;
Client.reconciliation = true;
Client.interpolation = true;
Client.opponentInputs = [];
Client.inputProcessor = null;

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

	var opponent = player === App.player ? App.opponent : App.player;
	var keys = Config.keyBindings;

	var x = player.getLocation().getX();
	var y = player.getLocation().getY();
	var z = player.getZ();

	if (input.key === keys.UP_RIGHT) {
		x += Config.playerMoveSpeed;
		y -= Config.playerMoveSpeed;
	}
	else if (input.key === keys.UP_LEFT) {
		x -= Config.playerMoveSpeed;
		y -= Config.playerMoveSpeed;
	}
	else if (input.key === keys.DOWN_LEFT) {
		x -= Config.playerMoveSpeed;
		y += Config.playerMoveSpeed;
	}
	else if (input.key === keys.DOWN_RIGHT) {
		x += Config.playerMoveSpeed;
		y += Config.playerMoveSpeed;
	}
	else if (input.key === keys.RIGHT) {
		x += Config.playerMoveSpeed;
	}
	else if (input.key === keys.LEFT) {
		x -= Config.playerMoveSpeed;
	}
	else if (input.key === keys.UP) {
		y -= Config.playerMoveSpeed;
	}
	else if (input.key === keys.DOWN) {
		y += Config.playerMoveSpeed;
	}

	Client.applyCoordinates(player, x, y, z);
};

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
    	var ppunched = state.player.punched;
    	var ox = state.opponent.x;
    	var oy = state.opponent.y;
    	var opunched = state.opponent.punched;
    	var oz = state.opponent.z;

    	Client.applyCoordinates(App.player, x, y, null);

    	App.player.setPunched(ppunched);
    	App.opponent.setPunched(opunched);

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

Client.processLocalInputs = function () {
	var player = App.player;
	var packet = Client.inputProcessor.processInputs();

	if (Client.prediction) {
		Client.applyInput(player, packet);
		if (Client.reconciliation) {
			Client.storeInput(packet);
		}
	}
	Client.updatePlayerAnimation(packet);
	return packet;
};

Client.sendServerUpdate = function (packet) {
	var player = App.player;
	var animationName = player.getSpriteSheet().getCurrentAnimation();
	packet.animationName = animationName;
	socket.emit('update', packet);
};

Client.updatePlayerAnimation = function (packet) {
	var keys = Config.keyBindings;
	var player = App.player;
	var playerSprite = player.getSpriteSheet();

	if (packet.kickCombo) {
		playerSprite.setActiveAnimation('kickComboAnimation');
	} else if (packet.punchCombo) {
		playerSprite.setActiveAnimation('punchComboAnimation');
	} else if (packet.punchKey) {
		var punchNumber = Math.ceil(Math.random() * 2);
		playerSprite.setActiveAnimation('punchAnimation' + punchNumber);
	} else if (packet.kickKey) {
		playerSprite.setActiveAnimation('kickAnimation');
	} else if (packet.jumpKey) {
		playerSprite.setActiveAnimation('jumpAnimation');
	} else if (packet.key === keys.DEFEND) {
		playerSprite.setActiveAnimation('defendAnimation');
	}

	if (player.isStanding()) {
		if (packet.key !== 0) {
			playerSprite.setActiveAnimation('moveAnimation');
		}
		else if (player.isPunched()) {
			playerSprite.setActiveAnimation('damageAnimation');
		}
		else if (!player.isPunched()) {
			playerSprite.setActiveAnimation('standAnimation');
		}
	}
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

Client.comboPunch = function () {
	var t = 0;
	var player = App.player;
	var updateP = setInterval(function(){
		t += 30;
		if(t >= 800){
			player.setUsingCombo(0);
			player.getSpriteSheet().setActiveAnimation('standAnimation');
			clearInterval(updateP);
		}
	}, 1000/30);
};

Client.comboKick = function () {
	var t = 0;
	var player = App.player;
	var updateP = setInterval(function() {
		t += 30;
		if(t >= 600) {
			player.setUsingCombo(0);
			player.getSpriteSheet().setActiveAnimation('standAnimation');
			clearInterval(updateP);
		}
	}, 1000 / 30);
}

Client.punch = function() {
	var t = 0;
	var updateP = setInterval(function(){
		var player = App.player;
		t += 30;
		if (player.usingCombo()) {
			player.setPunchState(0);
			clearInterval(updateP);
		}
		if(t >= 300){
			player.setPunchState(0);
			player.getSpriteSheet().setActiveAnimation('standAnimation');
			clearInterval(updateP);
		}
	}, 1000/30);
};

Client.kick = function() {
	var t = 0;
	var updateP = setInterval(function(){
		var player = App.player;
		t += 30;
		if(player.usingCombo()){
			player.setKickState(0);
			clearInterval(updateP);
		}
		if(t >= 400){
			player.getSpriteSheet().setActiveAnimation('standAnimation');
			player.setKickState(0);
			clearInterval(updateP);
		}
	}, 1000/30);
};

Client.flipPlayerSpritesheets = function() {
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
	var packet = Client.processLocalInputs();
	Client.sendServerUpdate(packet);
	if (Client.interpolation) {
		Client.interpolate();
	}
	App.player.update();
	App.opponent.update();
	Client.flipPlayerSpritesheets();
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
		console.log(App.player.isPunched());
	}, 1000 / 30);
};