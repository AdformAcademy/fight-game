var App = require('../app');
var Config = require('./config');
var Player = require('./player');
var Point = require('../../common/point');
var SpriteSheet = require('./canvas/spritesheet');
var LifeBar = require('./canvas/life-bar');
var EnergyBar = require('./canvas/energy-bar');
var InputCollection = require('./input-collection');
var InputProcessor = require('./input-processor');
var WorldPhysics = require('./world-physics');
var CountDownScreen = require('./screen/count-down');
var Rectangle = require('./canvas/rectangle');
var Camera = require('./canvas/camera');
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
Client.camera = null;
Client.world = null;

Client.storeInput = function(input) {
	Client.inputs.push(input);
};

Client.storeServerData = function(data) {
	Client.serverData.push(data);
};

Client.interpolate = function() {
	var physics = App.physics;
	var bufferSize = Client.opponentInputs.length;
	var opponent = App.opponent;
	if (bufferSize < 10) {
		var input = Client.opponentInputs[0];
		if (input !== undefined) {
			physics.applyCoordinates(opponent, input.x, input.z);
			opponent.getSpriteSheet().setActiveAnimation(input.currentAnimation);
			Client.opponentInputs.shift();
		}
	} else {
		var lastInput = Client.opponentInputs[bufferSize - 1];
		physics.applyCoordinates(opponent, lastInput.x, lastInput.z);
		opponent.getSpriteSheet().setActiveAnimation(lastInput.currentAnimation);
		Client.opponentInputs = [];
	}
};

Client.reconciliate = function(state) {
	var physics = App.physics;
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
	var physics = App.physics;
    for (var i = 0; i < Client.serverData.length; i++) {
    	var state = Client.serverData[i];
    	var x = state.player.x;
    	var ppunched = state.player.punched;
    	var pVictor = state.player.victor;
    	var pDefeated = state.player.defeated;
    	var ox = state.opponent.x;
    	var opunched = state.opponent.punched;
    	var oVictor = state.opponent.victor;
    	var oDefeated = state.opponent.defeated;
    	var oz = state.opponent.z;
    	var lives = state.player.lives;
    	var olives = state.opponent.lives;
    	var playerLifeBar = App.player.getLifeBar();
    	var opponentLifeBar = App.opponent.getLifeBar();
    	var playerEnergyBar = App.player.getEnergyBar();
    	var opponentEnergyBar = App.opponent.getEnergyBar();

    	physics.applyCoordinates(App.player, x, null);
    	
    	if (ppunched) {
    		playerLifeBar.store(state.player.lives);
    	}
    	if (opunched) {
    		opponentLifeBar.store(state.opponent.lives);
    	}
    	
    	playerEnergyBar.store(state.player.energy);
    	opponentEnergyBar.store(state.opponent.energy);

    	App.player.setPunched(ppunched);
    	App.player.Victory(pVictor);
    	App.player.Defeat(pDefeated);
    	App.opponent.setPunched(opunched);
    	App.opponent.Victory(oVictor);
    	App.opponent.Defeat(oDefeated);

    	if (Client.interpolation) {
    		Client.appendOpponentInputs(state.opponent.sequence);
    	} else {
    		physics.applyCoordinates(App.opponent, ox, oz);
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
	var physics = App.physics;
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

Client.initializeGame = function (data) {
	var canvas = App.canvasObj;
	var playerSpriteData = data.player.data.spriteSheetData;
	var opponentSpriteData = data.opponent.data.spriteSheetData;
	var playerSpriteImage = new Image();
	playerSpriteImage.src = './img/' + playerSpriteData.spriteSheetImage;

	var opponentSpriteImage = new Image();
	opponentSpriteImage.src = './img/' + opponentSpriteData.spriteSheetImage;

	var buildSprite = function(image, spriteSheetData) {
		return new SpriteSheet({
			image: image,
			data: spriteSheetData,
			frames: 1,
		});
	};

	var playerSprite = buildSprite(playerSpriteImage, playerSpriteData);
	var opponentSprite = buildSprite(opponentSpriteImage, opponentSpriteData);

	App.player = new Player({
		location: data.player.x,
		spriteSheet: playerSprite,
		energyCosts: data.player.energyCosts,
		lifeBar: new LifeBar({
			location: function () {
				return new Point(Config.progressBarPadding, Config.progressBarPadding);
			},
			width: function () {
				return canvas.getWidth() * Config.lifeBarWidthRatio;
			},
			height: function () {
				return Config.lifeBarHeight;
			},
			currentValue: data.player.data.lives,
			maxValue: data.player.data.lives
		}),
		energyBar: new EnergyBar({
			location: function() {
				return new Point(Config.progressBarPadding,
				Config.progressBarPadding * 2 + Config.lifeBarHeight);
			},
			width: function () {
				return canvas.getWidth() * Config.energyBarWidthRatio;
			},
			height: function () {
				return Config.energyBarHeight;
			},
			currentValue: 0,
			maxValue: data.player.data.maxEnergy
		})
	});

	App.opponent = new Player({
		location: data.opponent.x,
		spriteSheet: opponentSprite,
		energyCosts: data.opponent.energyCosts,
		lifeBar: new LifeBar({
			location: function () {
			return new Point(
				Math.round(canvas.getWidth() * 
				(1 - Config.lifeBarWidthRatio) - Config.progressBarPadding),
				Config.progressBarPadding);
			},
			width: function () {
				return canvas.getWidth() * Config.lifeBarWidthRatio;
			},
			height: function () {
				return Config.lifeBarHeight;
			},
			currentValue: data.opponent.data.lives,
			maxValue: data.opponent.data.lives
		}),
		energyBar: new EnergyBar({
			location: function() {
			return new Point(
				Math.round(canvas.getWidth() * 
				(1 - Config.energyBarWidthRatio) - Config.progressBarPadding),
				Config.progressBarPadding * 2 + Config.lifeBarHeight);
			},
			width: function () {
				return canvas.getWidth() * Config.energyBarWidthRatio;
			},
			height: function () {
			return Config.energyBarHeight;
			},
			currentValue: 0,
			maxValue: data.opponent.data.maxEnergy
		})
	});

	Client.world = new Rectangle(0, 0, 
		data.map.dimensions.width, data.map.dimensions.height);

	Client.camera = new Camera({
		yView: 0,
		xView: 0,
		canvasWidth: canvas.getWidth(),
		canvasHeight: canvas.getHeight(),
		axis: 'horizontal',
		worldRect: Client.world
	});

	Client.camera.follow(App.player, canvas.getWidth() / 2, canvas.getHeight() / 2);

	App.physics = new WorldPhysics({
		player: App.player,
		opponent: App.opponent,
		world: Client.world
	});

	Client.inputProcessor = new InputProcessor({
		player: App.player,
		opponent: App.opponent,
		world: Client.world
	});

	App.screen.dispose();
	App.screen = new CountDownScreen();
	App.canvasObj.setGraphics(App.screen.graphics);
};

Client.update = function() {
	var physics = App.physics;
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
	Client.camera.update();
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