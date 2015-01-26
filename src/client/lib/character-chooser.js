var App = require('../app');
var InputCollection = require('./input-collection');
var WaitingScreen = require('./screen/waiting');
var socket = io();

var CharacterChooser = {};

CharacterChooser.isRunning = false;
CharacterChooser.updateInterval = null;
CharacterChooser.screen = null;
CharacterChooser.activeButton = 0;
CharacterChooser.buttons = null;

CharacterChooser.resetUnactiveButton = function (index) {
	var button = CharacterChooser.buttons[index];
	if (button !== undefined) {
		var spriteSheet = button.getSpriteSheet();
		spriteSheet.setCurrentFrame(0);
	}
};

CharacterChooser.updateActiveButton = function () {
	var button = CharacterChooser.buttons[CharacterChooser.activeButton];
	if (button !== undefined) {
		var spriteSheet = button.getSpriteSheet();
		spriteSheet.update();
	}
};

CharacterChooser.choose = function (id) {
	socket.emit('ready', id);
	var screen = App.screen;
	screen.dispose();
	App.screen = new WaitingScreen();
	App.canvasObj.setGraphics(App.screen.graphics);
	CharacterChooser.stop();
};

CharacterChooser.handleControls = function () {
	var control = InputCollection;
	var oldActiveButton = CharacterChooser.activeButton;
	if (control.isPressed(39)) {
		CharacterChooser.activeButton++;
		if (CharacterChooser.activeButton + 1 > CharacterChooser.buttons.length) {
			CharacterChooser.activeButton = 0;
		}
	}
	else if (control.isPressed(37)) {
		CharacterChooser.activeButton--;
		if (CharacterChooser.activeButton < 0) {
			CharacterChooser.activeButton = CharacterChooser.buttons.length - 1;
		}
	} else if (control.isPressed(38) || (control.isPressed(40))) {
		CharacterChooser.activeButton += CharacterChooser.buttons.length / 2;
		CharacterChooser.activeButton %= CharacterChooser.buttons.length;
	} else if (control.isPressed(13)) {
		var button = CharacterChooser.buttons[CharacterChooser.activeButton];
		var id = button.getId();
		CharacterChooser.choose(id);
		return;
	}
	if (oldActiveButton !== CharacterChooser.activeButton) {
		CharacterChooser.resetUnactiveButton(oldActiveButton);
	}
};

CharacterChooser.update = function() {
	CharacterChooser.handleControls();
	if (CharacterChooser.isRunning) {
		CharacterChooser.updateActiveButton();
	}
};

CharacterChooser.stop = function() {
	CharacterChooser.isRunning = false;
	CharacterChooser.screen = null;
	CharacterChooser.activeButton = 0;
	CharacterChooser.buttons = null;
	clearInterval(CharacterChooser.updateInterval);
};

CharacterChooser.start = function(screen) {
	CharacterChooser.isRunning = true;
	CharacterChooser.screen = screen;
	CharacterChooser.buttons = screen.getButtons();
	CharacterChooser.updateInterval = setInterval(function() {
		CharacterChooser.update();
	}, 1000 / 30);
};

module.exports = CharacterChooser;