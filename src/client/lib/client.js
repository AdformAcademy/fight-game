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
Client.physics = null;
Client.inputProcessor = null;

Client.storeInput = function(input) {
	Client.inputs.push(input);
};

Client.storeServerData = function(data) {
	Client.serverData.push(data);
};

Client.interpolate = function() {
	var physics = Client.physics;
	var bufferSize = Client.opponentInputs.length;
	var opponent = App.opponent;
	if (bufferSize < 10) {
		var input = Client.opponentInputs[0];
		if (input !== undefined) {
			physics.applyCoordinates(opponent, input.x, input.y, input.z);
			opponent.getSpriteSheet().setActiveAnimation(input.currentAnimation);
			Client.opponentInputs.shift();
		}
	} else {
		var lastInput = Client.opponentInputs[bufferSize - 1];
		physics.applyCoordinates(opponent, lastInput.x, lastInput.y, lastInput.z);
		opponent.getSpriteSheet().setActiveAnimation(lastInput.currentAnimation);
		Client.opponentInputs = [];
	}
};

Client.reconciliate = function(state) {
	var physics = Client.physics;
	var j = 0;
	while (j < Client.inputs.length) {
		var input = Client.inputs[j];
		if (input.id <= state.player.input.id) {
			Client.inputs.splice(j, 1);
		} else {
			physics.applyInput(App.player, input);
			j++;
		}
	}
};

Client.processServerData = function() {
	var physics = Client.physics;
    for (var i = 0; i < Client.serverData.length; i++) {
    	var state = Client.serverData[i];
    	var x = state.player.x;
    	var y = state.player.y;
    	var ppunched = state.player.punched;
    	var ox = state.opponent.x;
    	var oy = state.opponent.y;
    	var opunched = state.opponent.punched;
    	var oz = state.opponent.z;
    	var lives = state.player.lives;
    	var olives = state.opponent.lives;
    	var playerLifeBar = App.player.getLifeBar();
    	var opponentLifeBar = App.opponent.getLifeBar();

    	physics.applyCoordinates(App.player, x, y, null);
    	console.log('player lives: ' + lives + ', opponent lives ' + olives);
    	
    	playerLifeBar.update(state.player.lives);
    	opponentLifeBar.update(state.opponent.lives);

    	App.player.setPunched(ppunched);
    	App.opponent.setPunched(opunched);

    	if (Client.interpolation) {
    		Client.appendOpponentInputs(state.opponent.sequence);
    	} else {
    		physics.applyCoordinates(App.opponent, ox, oy, oz);
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
	var physics = Client.physics;
	var player = App.player;
	var packet = Client.inputProcessor.processInputs();

	if (Client.prediction) {
		physics.applyInput(player, packet);
		if (Client.reconciliation) {
			Client.storeInput(packet);
		}
	}
	physics.updatePlayerAnimation(packet);
	return packet;
};

Client.sendServerUpdate = function (packet) {
	var player = App.player;
	var animationName = player.getSpriteSheet().getCurrentAnimation();
	packet.animationName = animationName;
	socket.emit('update', packet);
};

Client.update = function() {
	var physics = Client.physics;
	Client.processServerData();
	var packet = Client.processLocalInputs();
	Client.sendServerUpdate(packet);
	if (Client.interpolation) {
		Client.interpolate();
	}
	App.player.update();
	App.opponent.update();
	physics.flipPlayerSpritesheets();
	physics.updatePlayersDepth();
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