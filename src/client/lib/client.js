var App = require('../app');
var Config = require('./config');
var Player = require('./player');
var Point = require('../../common/point');
var SpriteSheet = require('./canvas/spritesheet');
var LifeBar = require('./canvas/life-bar');
var EnergyBar = require('./canvas/energy-bar');
var InputCollection = require('./input-collection');
var InputProcessor = require('./input-processor');
var SoundCollection = require('./sound-collection');
var WorldPhysics = require('./world-physics');
var StageScreen = require('./screen/stage');
var TrainingScreen = require('./screen/training');
var Rectangle = require('./canvas/rectangle');
var Camera = require('./canvas/camera');
var Parallax = require('./canvas/parallax');
var Pattern = require('./canvas/pattern');
var ResourceLoader = require('./utils/resource-loader');
var socket = io();

var Client = module.exports = {};

Client.games = {
	MATCH: 'match',
	TOURNAMENT: 'tournament'
};

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
Client.parallax = null;
Client.catchingInterpolation = false;
Client.gameStarted = false;
Client.canMove = false;
Client.gameType = null;
Client.isTraining = false;
Client.defeat = false;
Client.initializeType = 0;

Client.storeInput = function(input) {
	Client.inputs.push(input);
};

Client.storeServerData = function(data) {
	Client.serverData.push(data);
};

Client.catchUpInterpolation = function () {
	console.log('Cathing up');
	Client.catchingInterpolation = true;
	var physics = App.physics;
	var opponent = App.opponent;
	var update = setInterval(function () {	
		var bufferSize = Client.opponentInputs.length;
		if (bufferSize > 20) {
			var lastInput = Client.opponentInputs[bufferSize - 1];
			physics.applyCoordinates(opponent, lastInput.x, lastInput.z);
			opponent.getSpriteSheet().setActiveAnimation(lastInput.currentAnimation);
			Client.opponentInputs = [];
		} else {
			var input = Client.opponentInputs[0];
			if (input !== undefined) {
				physics.applyCoordinates(opponent, input.x, input.z);
				opponent.getSpriteSheet().setActiveAnimation(input.currentAnimation);
				Client.opponentInputs.shift();
			}
		}
		if (Client.opponentInputs.length < 1) {
			Client.catchingInterpolation = false;
			console.log('END');
			clearInterval(update);
		}
	}, 1000 / 35);
};

Client.interpolate = function() {
	if (!Client.catchingInterpolation) {
		var physics = App.physics;
		var bufferSize = Client.opponentInputs.length;
		var opponent = App.opponent;
		if (bufferSize < 5) {
			var input = Client.opponentInputs[0];
			if (input !== undefined) {
				physics.applyCoordinates(opponent, input.x, input.z);
				opponent.getSpriteSheet().setActiveAnimation(input.currentAnimation);
				Client.opponentInputs.shift();
			}
		} else if (bufferSize > 20) {
			var lastInput = Client.opponentInputs[bufferSize - 1];
			physics.applyCoordinates(opponent, lastInput.x, lastInput.z);
			opponent.getSpriteSheet().setActiveAnimation(lastInput.currentAnimation);
			Client.opponentInputs = [];
		} else {
			Client.catchUpInterpolation();
		}
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
    	var pDefending = state.player.defending;
    	var pMoving = state.player.moving;
    	var hiting = state.player.hiting;
    	var pSpeed = state.player.speed;
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
    	var sounds = state.player.sounds;
    	var pFatality = state.player.fatality;
    	var oFatality = state.opponent.fatality;
    	var hitByCombo = state.player.hitcombo;

    	physics.applyCoordinates(App.player, x, null);
    	SoundCollection.playServerSounds(sounds);

    	if (ppunched) {
    		playerLifeBar.store(state.player.lives);
    	}
    	if (opunched) {
    		opponentLifeBar.store(state.opponent.lives);
    	}

		if (hitByCombo) {
			physics.shakeCamera(3, 5000, 1.02);
		}

		if ((pDefeated || oDefeated) && !Client.defeat) {
			physics.shakeCamera(8, 5000, 1.09);
			Client.defeat = true;
		}
    	
    	playerEnergyBar.store(state.player.energy);
    	opponentEnergyBar.store(state.opponent.energy);

    	App.player.setPunched(ppunched);
    	App.player.Victory(pVictor);
    	App.player.Defeat(pDefeated);
    	App.player.setDefending(pDefending);
    	App.player.setMoving(pMoving);
    	App.player.Fatality(pFatality);
    	App.player.setSpeed(pSpeed);
    	App.player.setHiting(hiting);
    	App.opponent.setPunched(opunched);
    	App.opponent.Victory(oVictor);
    	App.opponent.Defeat(oDefeated);
    	App.opponent.Fatality(oFatality);

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
		if (Client.reconciliation && !Client.isTraining) {
			Client.storeInput(packet);
		}
	}
	physics.updatePlayerAnimation(packet);
	physics.applyParallax(packet);
	return packet;
};

Client.sendServerUpdate = function (packet) {
	var player = App.player;
	var animationName = player.getSpriteSheet().getCurrentAnimation();
	packet.animationName = animationName;
	socket.emit('update', packet);
};

Client.initializeGame = function (data) {
	Client.initializeType = 1;
	var loader = new ResourceLoader(function () {
		App.screen.dispose();
		App.screen = new StageScreen();
		App.canvasObj.setGraphics(App.screen.graphics);
	});
	var canvas = App.canvasObj;
	var playerSpriteData = data.player.data.spriteSheetData;
	var opponentSpriteData = data.opponent.data.spriteSheetData;
	var mapData = data.map;

	var id = loader.append();
	var playerSpriteImage = new Image();
	playerSpriteImage.src = './img/characters/' + playerSpriteData.spriteSheetImage;
	playerSpriteImage.onload = function (id) {
		return function () {
			loader.load(id);
		};
	}(id);

	id = loader.append();
	var opponentSpriteImage = new Image();
	opponentSpriteImage.src = './img/characters/' + opponentSpriteData.spriteSheetImage;
	opponentSpriteImage.onload = function (id) {
		return function () {
			loader.load(id);
		};
	}(id);

	SoundCollection.clear();
	SoundCollection.load(loader, data.soundsData, data.player.data, data.opponent.data);

	var buildSprite = function(image, spriteSheetData) {
		return new SpriteSheet({
			image: image,
			data: spriteSheetData,
			frames: 1,
		});
	};

	var playerSprite = buildSprite(playerSpriteImage, playerSpriteData);
	var opponentSprite = buildSprite(opponentSpriteImage, opponentSpriteData);
	var LBY = Config.progressBarPadding;

	App.player = new Player({
		name: data.player.data.name,
		data: data.player.data,
		location: data.player.x,
		z: data.player.y,
		groundHeight: function () {
			return canvas.getHeight() * (mapData.groundHeight / 100);
		},
		spriteSheet: playerSprite,
		energyCosts: data.player.energyCosts,
		lifeBar: new LifeBar({
			loader: loader,
			location: function () {
				if(data.player.x < data.opponent.x){
					var PLBX = Config.progressBarPadding;
				}
				else{
					var PLBX = Math.round(canvas.getWidth() 
						* (1 - Config.lifeBarWidthRatio) - Config.progressBarPadding);
				}
				return new Point(PLBX, LBY);
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
			loader: loader,
			location: function() {
				if(data.player.x < data.opponent.x){
					var PLBX = Config.progressBarPadding;
				}
				else{
					var PLBX = Math.round(canvas.getWidth() 
						* (1 - Config.energyBarWidthRatio) - Config.progressBarPadding);
				}
				return new Point(PLBX, LBY * 2 + Config.lifeBarHeight);
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
		name: data.opponent.data.name,
		data: data.opponent.data,
		location: data.opponent.x,
		z: data.opponent.y,
		groundHeight: function () {
			return canvas.getHeight() * (mapData.groundHeight / 100);
		},
		spriteSheet: opponentSprite,
		energyCosts: data.opponent.energyCosts,
		lifeBar: new LifeBar({
			loader: loader,
			location: function () {
				if(data.player.x < data.opponent.x) {
					var OpLBX = Math.round(canvas.getWidth() 
						* (1 - Config.lifeBarWidthRatio) - Config.progressBarPadding);
				}
				else {
					var OpLBX = Config.progressBarPadding;
				}
				return new Point(OpLBX, LBY);
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
			loader: loader,
			location: function() {
				if(data.player.x < data.opponent.x) {
					var OpLBX = Math.round(canvas.getWidth() 
						* (1 - Config.energyBarWidthRatio) - Config.progressBarPadding);
				}
				else {
					var OpLBX = Config.progressBarPadding;
				}
				return new Point(OpLBX, LBY * 2 + Config.lifeBarHeight);
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
		mapData.dimensions.width, mapData.dimensions.height);

	Client.camera = new Camera({
		yView: 0,
		xView: 0,
		canvasWidth: canvas.getWidth(),
		canvasHeight: canvas.getHeight(),
		axis: 'horizontal',
		worldRect: Client.world
	});

	Client.camera.follow(App.player, canvas.getWidth() / 2, canvas.getHeight() / 2, 0);

	Client.inputProcessor = new InputProcessor({
		player: App.player,
		opponent: App.opponent,
		world: Client.world,
		parallax: Client.parallax,
		camera: Client.camera
	});

	var parallax = new Parallax(Client.camera);

	for (var pattern in mapData.patterns) {

		var yLocation = function (pattern) {
			return function () {
				var top = canvas.getHeight() * (mapData.patterns[pattern].top / 100);
				return top;
			};
		}(pattern);
		
		var speed = mapData.patterns[pattern].speed;
		var imageLocation = './img/maps/map' + mapData.id + '/pattern' + pattern + '.png';
		var parallaxPattern = new Pattern(loader, yLocation, speed, imageLocation);
		parallax.addPattern(parallaxPattern);
	}

	Client.parallax = parallax;

	App.physics = new WorldPhysics({
		player: App.player,
		opponent: App.opponent,
		world: Client.world,
		parallax: Client.parallax,
		camera: Client.camera,
		training: Client.isTraining
	});

	App.screen.load('Opponent found');
};

Client.initializeTraining = function (data) {
	Client.initializeType = 2;
	var loader = new ResourceLoader(function () {
		if (Client.initializeType == 2) {
			App.screen.dispose();
			App.screen = new TrainingScreen();
			App.canvasObj.setGraphics(App.screen.graphics);
		}
	});
	var canvas = App.canvasObj;
	var playerSpriteData = data.player.data.spriteSheetData;
	var mapData = data.map;

	var id = loader.append();
	var playerSpriteImage = new Image();
	playerSpriteImage.src = './img/characters/' + playerSpriteData.spriteSheetImage;
	playerSpriteImage.onload = function (id) {
		return function () {
			loader.load(id);
		};
	}(id);

	SoundCollection.clear();
	SoundCollection.load(loader, data.soundsData, data.player.data, data.player.data);

	var buildSprite = function(image, spriteSheetData) {
		return new SpriteSheet({
			image: image,
			data: spriteSheetData,
			frames: 1,
		});
	};

	var playerSprite = buildSprite(playerSpriteImage, playerSpriteData);
	var opponentSprite = buildSprite(playerSpriteImage, playerSpriteData);
	var LBY = Config.progressBarPadding;

	App.player = new Player({
		name: data.player.data.name,
		data: data.player.data,
		location: data.player.x,
		speed: data.player.data.speed,
		z: data.player.y,
		groundHeight: function () {
			return canvas.getHeight() * (mapData.groundHeight / 100);
		},
		spriteSheet: playerSprite,
		energyCosts: data.player.energyCosts,
		lifeBar: new LifeBar({
			loader: loader,
			location: function () {
				if(data.player.x < data.opponent.x){
					var PLBX = Config.progressBarPadding;
				}
				else{
					var PLBX = Math.round(canvas.getWidth() 
						* (1 - Config.lifeBarWidthRatio) - Config.progressBarPadding);
				}
				return new Point(PLBX, LBY);
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
			loader: loader,
			location: function() {
				if(data.player.x < data.opponent.x){
					var PLBX = Config.progressBarPadding;
				}
				else{
					var PLBX = Math.round(canvas.getWidth() 
						* (1 - Config.energyBarWidthRatio) - Config.progressBarPadding);
				}
				return new Point(PLBX, LBY * 2 + Config.lifeBarHeight);
			},
			width: function () {
				return canvas.getWidth() * Config.energyBarWidthRatio;
			},
			height: function () {
				return Config.energyBarHeight;
			},
			currentValue: data.player.data.maxEnergy,
			maxValue: data.player.data.maxEnergy
		})
	});

	App.opponent = new Player({
		name: data.player.data.name,
		data: data.player.data,
		location: data.opponent.x,
		z: data.player.y,
		groundHeight: function () {
			return canvas.getHeight() * (mapData.groundHeight / 100);
		},
		spriteSheet: opponentSprite,
		energyCosts: data.player.energyCosts,
		lifeBar: new LifeBar({
			loader: loader,
			location: function () {
				if(data.player.x < data.opponent.x){
					var PLBX = Config.progressBarPadding;
				}
				else{
					var PLBX = Math.round(canvas.getWidth() 
						* (1 - Config.lifeBarWidthRatio) - Config.progressBarPadding);
				}
				return new Point(PLBX, LBY);
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
			loader: loader,
			location: function() {
				if(data.player.x < data.opponent.x){
					var PLBX = Config.progressBarPadding;
				}
				else{
					var PLBX = Math.round(canvas.getWidth() 
						* (1 - Config.energyBarWidthRatio) - Config.progressBarPadding);
				}
				return new Point(PLBX, LBY * 2 + Config.lifeBarHeight);
			},
			width: function () {
				return canvas.getWidth() * Config.energyBarWidthRatio;
			},
			height: function () {
				return Config.energyBarHeight;
			},
			currentValue: data.player.data.maxEnergy,
			maxValue: data.player.data.maxEnergy
		})
	});

	Client.world = new Rectangle(0, 0, 
		mapData.dimensions.width, mapData.dimensions.height);

	Client.camera = new Camera({
		yView: 0,
		xView: 0,
		canvasWidth: canvas.getWidth(),
		canvasHeight: canvas.getHeight(),
		axis: 'horizontal',
		worldRect: Client.world
	});

	Client.camera.follow(App.player, canvas.getWidth() / 2, canvas.getHeight() / 2, 0);

	Client.inputProcessor = new InputProcessor({
		player: App.player,
		opponent: App.opponent,
		world: Client.world,
		parallax: Client.parallax,
		camera: Client.camera
	});

	var parallax = new Parallax(Client.camera);

	for (var pattern in mapData.patterns) {

		var yLocation = function (pattern) {
			return function () {
				var top = canvas.getHeight() * (mapData.patterns[pattern].top / 100);
				return top;
			};
		}(pattern);
		
		var speed = mapData.patterns[pattern].speed;
		var imageLocation = './img/maps/map' + mapData.id + '/pattern' + pattern + '.png';
		var parallaxPattern = new Pattern(loader, yLocation, speed, imageLocation);
		parallax.addPattern(parallaxPattern);
	}

	Client.parallax = parallax;

	App.physics = new WorldPhysics({
		player: App.player,
		opponent: App.opponent,
		world: Client.world,
		parallax: Client.parallax,
		camera: Client.camera,
		training: Client.isTraining
	});

	App.screen.load('');
};

Client.startGame = function () {
	Client.gameStarted = true;
	Client.canMove = true;
};

Client.setGameType = function (gameType) {
	Client.gameType = gameType;
};

Client.getGameType = function () {
	return Client.gameType;
};

Client.update = function() {
	var canvas = App.canvasObj;
	var physics = App.physics;

	if (!Client.isTraining) {
		Client.processServerData();
	}

	if (Client.gameStarted && Client.canMove) {
		var packet = Client.processLocalInputs();
		if (!Client.isTraining) {
			Client.sendServerUpdate(packet);
			if (Client.interpolation) {
				Client.interpolate();
			}
		}
		App.player.update();
		App.opponent.update();
	}

	physics.flipPlayerSpritesheets();
	physics.updatePlayersDepth();
	physics.updateViewport();	

	Client.camera.update();
};

Client.stop = function() {
	clearInterval(Client.updateWorldInterval);
	Client.inputs = [];
	Client.serverData = [];
	Client.inputCounter = 0;
	Client.updateWorldInterval = null;
	Client.isRunning = false;
	Client.opponentInputs = [];
	Client.inputProcessor = null;
	Client.camera = null;
	Client.world = null;
	Client.parallax = null;
	Client.catchingInterpolation = false;
	Client.gameStarted = false;
	Client.canMove = false;
	Client.isTraining = false;
	Client.defeat = false;
	Client.initializeType = 0;
};

Client.start = function() {
	if (!Client.isRunning) {
		Client.isRunning = true;
		Client.updateWorldInterval = setInterval(function() {
			Client.update();
		}, 1000 / 30);
	}
};