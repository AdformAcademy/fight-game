var App = require('../app');
var InputCollection = require('./input-collection');
var ChooseScreen = require('./screen/choose');
var WaitingScreen = require('./screen/waiting');
var Button = require('./canvas/button');
var SpriteSheet = require('./canvas/spritesheet');
var Point = require('../../common/point')
var socket = io();
var Config = require('./config');
var EventCollection = require('./event-collection');
var Player = require('./player');
var CharacterChooser = {};

CharacterChooser.isRunning = false;
CharacterChooser.updateInterval = null;
CharacterChooser.screen = null;
CharacterChooser.activeButton = 0;
CharacterChooser.buttons = null;
CharacterChooser.data = null;
CharacterChooser.choosenPlayer = null;
CharacterChooser.socketTarget = null;

CharacterChooser.setSocketTarget = function (target) {
	CharacterChooser.socketTarget = target;
};

CharacterChooser.resetUnactiveButton = function (index) {
	var button = CharacterChooser.buttons[index];
	if (button !== undefined) {
		var spriteSheet = button.getSpriteSheet();
		spriteSheet.setCurrentFrame(0);
		button.setBorderColor('#5E5E5E');
	}
};

CharacterChooser.updateActiveButton = function () {
	var button = CharacterChooser.buttons[CharacterChooser.activeButton];
	if (button !== undefined) {
		var spriteSheet = button.getSpriteSheet();
		spriteSheet.update();
		button.setBorderColor('#DEDEDE');
	}
};

CharacterChooser.loadWaitingScreen = function (id) {
	if (CharacterChooser.isRunning) {
		socket.emit(CharacterChooser.socketTarget, id);
		var screen = App.screen;
		screen.dispose();
		App.screen = new WaitingScreen();
		App.canvasObj.setGraphics(App.screen.graphics);
		CharacterChooser.stop();
	}
};

CharacterChooser.loadTournamentScreen = function (id) {
	if (CharacterChooser.isRunning) {
		socket.emit(CharacterChooser.socketTarget, id);
		var screen = App.screen;
		screen.dispose();
		App.screen = new TournamentWaitingScreen();
		App.canvasObj.setGraphics(App.screen.graphics);
		CharacterChooser.stop();
	}
};

CharacterChooser.preview = function (id) {

	var movements = [
		'punchComboAnimation',
		'kickComboAnimation',
		'kickAnimation',
		'jumpAnimation',
		'defendAnimation',
		'moveLeftAnimation',
		'moveRightAnimation',
		'damageAnimation',
		'jumpPunchAnimation',
		'jumpKickAnimation',
		'punchAnimation1',
		'punchAnimation2',
		'fatalityAnimation',
		'beatenAnimation'
	];

	var screen = App.screen;
	var comboTimer = 0;
	var playerSprite = CharacterChooser.choosenPlayer.getSpriteSheet();
	var previewCombo = setInterval(function () {
		comboTimer++;
		if (comboTimer > 15) {
			var randomCombo = Math.floor(Math.random() * movements.length);
			playerSprite.setActiveAnimation(movements[randomCombo]);
			comboTimer = 0;
		}
	}, 1000 / 30);

	var wait = setTimeout(function () {
		var fadeOut = setInterval(function () {
			screen.fadeValue -= 0.04;
			if (screen.fadeValue < 0) {
				screen.fadeValue = 0;
				clearInterval(fadeOut);
				clearInterval(previewCombo);
				CharacterChooser.loadWaitingScreen(id);
			}
		}, 1000 / 30);	
	}, 3000);
};

CharacterChooser.loadChosenCharacter = function (id) {
	var spriteSheetData = CharacterChooser.data['character' + id + '.json'].spriteSheetData;
	var canvas = App.canvasObj;
	var image = new Image();
	var screen = App.screen;
	image.src = './img/characters/' + spriteSheetData.spriteSheetImage;
	image.onload = function () {
		var playerSprite = new SpriteSheet({
			image: image,
			data: spriteSheetData,
			useScale: true,
			scaleWidth: spriteSheetData.spriteDimensions.frameWidth * 2,
			scaleHeight: spriteSheetData.spriteDimensions.height * 2
		});

		var player = new Player({
			location: canvas.getWidth() / 2 - playerSprite.getSpriteSheetWidth(),
			z: canvas.getHeight() / 2,
			groundHeight: function () {
				return 0;
			},
			spriteSheet: playerSprite,
			energyCosts: 0,
			lifeBar: {},
			energyBar: {}
		});

		CharacterChooser.choosenPlayer = player;
		screen.chosenPlayer = player;

		var animateFadeIn = setInterval(function () {
			screen.fadeValue += 0.04;
			if (screen.fadeValue > 1) {
				screen.fadeValue = 1;
				clearInterval(animateFadeIn);
				CharacterChooser.preview(id);
			}
		}, 1000 / 30);
	};
};

CharacterChooser.choose = function (id) {
	var screen = App.screen;
	var animateFade = setInterval(function () {
		screen.fadeValue -= 0.04;
		if (screen.fadeValue < 0) {
			screen.fadeValue = 0;
			clearInterval(animateFade);
			CharacterChooser.loadChosenCharacter(id);
		}
	}, 1000 / 30);
};

CharacterChooser.handleControls = function () {
	var control = InputCollection;
	var keys = Config.keyBindings;
	var oldActiveButton = CharacterChooser.activeButton;
	if (control.isPressed(keys.RIGHT)|| (control.isPressed(keys.RIGHT_ARROW))) {
		CharacterChooser.activeButton++;
		if (CharacterChooser.activeButton + 1 > CharacterChooser.buttons.length) {
			CharacterChooser.activeButton = 0;
		}
	}
	else if (control.isPressed(keys.LEFT) || (control.isPressed(keys.LEFT_ARROW))) {
		CharacterChooser.activeButton--;
		if (CharacterChooser.activeButton < 0) {
			CharacterChooser.activeButton = CharacterChooser.buttons.length - 1;
		}
	} else if (control.isPressed(keys.JUMP) 	|| control.isPressed(keys.UP_ARROW) ||
				 control.isPressed(keys.DEFEND)	|| control.isPressed(keys.DOWN_ARROW)) {
		CharacterChooser.activeButton += CharacterChooser.buttons.length / 2;
		CharacterChooser.activeButton %= CharacterChooser.buttons.length;
	} else if (control.isPressed(keys.ENTER)) {
		var button = CharacterChooser.buttons[CharacterChooser.activeButton];
		var id = button.getId();
		CharacterChooser.choose(id);
		return;
	}
	if (oldActiveButton !== CharacterChooser.activeButton) {
		CharacterChooser.resetUnactiveButton(oldActiveButton);
	}
};

CharacterChooser.createButtons = function (data) {
	CharacterChooser.data = data;
	var buttons = [];
	var startX = App.canvasObj.getWidth() * 0.125;
	var startY = App.canvasObj.getHeight() * 0.2;
	var width = 228;
	var height = 160;
	var shiftX = 0;
	var shiftY = 0;
	var margin = 3;
	var buttonsInRow = 3;
	var currentButton = 0;
	var currentRow = 0;

	for (var character in data) {
		var x = startX + shiftX + (margin * currentButton);
		var y = startY + shiftY + (margin * currentRow);
		var spriteImage = new Image();
		spriteImage.src = './img/characters/' 
			+ data[character].spriteSheetButton.spriteSheetIntroImage;
		var button = new Button({
			id: data[character].id,
			useSpriteSheet: true,
			spriteSheet: new SpriteSheet({
				image: spriteImage,
				data: data[character].spriteSheetButton,
				useScale: true,
				scaleWidth: width,
				scaleHeight: height
			}),
			location: new Point(x, y),
			drawBorder: true,
			borderWidth: 3,
			borderColor: '#5E5E5E',
			width: width,
			height: height
		});

		button.mouseOver(function() {
			var oldActiveButton = CharacterChooser.activeButton;
			CharacterChooser.activeButton = this.id - 1;
			if (oldActiveButton !== CharacterChooser.activeButton) {
				CharacterChooser.resetUnactiveButton(oldActiveButton);
			}
		});

		button.onClick(function() {
			var btn = CharacterChooser.buttons[CharacterChooser.activeButton];
			var id = btn.getId();
			for (var i = 0; i < CharacterChooser.buttons.length; i++) {
				EventCollection.removeOnClickObject(CharacterChooser.buttons[i]);
				EventCollection.removeMouseOverObject(CharacterChooser.buttons[i]);
			}
			CharacterChooser.choose(id);
		})

		EventCollection.addMouseOverObject(button);
		EventCollection.addOnClickObject(button);
		buttons.push(button);

		shiftX += width;
		currentButton++;
		if (currentButton + 1 > buttonsInRow) {
			currentButton = 0;
			currentRow++;
			shiftX = 0;
			shiftY += height;
		}
	}
	return buttons;
};

CharacterChooser.createScreen = function (data) {
	var buttons = CharacterChooser.createButtons(data);
	App.screen.dispose();
	var screen = new ChooseScreen();
	screen.setButtons(buttons);
	CharacterChooser.screen = screen;
	CharacterChooser.buttons = screen.getButtons();
	App.screen = screen;
	App.canvasObj.setGraphics(screen.graphics);
};

CharacterChooser.update = function() {
	CharacterChooser.handleControls();
	if (CharacterChooser.isRunning) {
		CharacterChooser.updateActiveButton();
		if (CharacterChooser.choosenPlayer !== null) {
			CharacterChooser.choosenPlayer.getSpriteSheet().update();
		}
	}
};

CharacterChooser.stop = function() {
	CharacterChooser.isRunning = false;
	if(CharacterChooser.screen) {
		CharacterChooser.screen.dispose();
	}
	CharacterChooser.screen = null;
	CharacterChooser.activeButton = 0;
	CharacterChooser.buttons = null;
	CharacterChooser.choosenPlayer = null;
	clearInterval(CharacterChooser.updateInterval);
};

CharacterChooser.start = function() {
	if(!CharacterChooser.isRunning) {
		CharacterChooser.isRunning = true;
		CharacterChooser.updateInterval = setInterval(function() {
			CharacterChooser.update();
		}, 1000 / 30);
	}
};

module.exports = CharacterChooser;