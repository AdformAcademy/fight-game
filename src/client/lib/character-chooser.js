var InputCollection = require('./input-collection');

var CharacterChooser = {};

CharacterChooser.isRunning = false;
CharacterChooser.updateInterval = null;
CharacterChooser.screen = null;
CharacterChooser.activeButton = 0;
CharacterChooser.buttons = null;

CharacterChooser.resetUnactiveButton = function (index) {
	var button = CharacterChooser.buttons[CharacterChooser.activeButton];
	if (button !== undefined) {
		var spriteSheet = button.getSpriteSheet();
		spriteSheet.setCurrentFrame(0);
	}
};

CharacterChooser.updateActiveButton = function () {
	var button = CharacterChooser.buttons[CharacterChooser.activeButton];
	if (button !== undefined) {
		var spriteSheet = button.getSpriteSheet();
		if (!spriteSheet.isLastFrame()) {
			spriteSheet.update();
		}
	}
};

CharacterChooser.handleControls = function () {
	var control = InputCollection;
	var oldActiveButton = CharacterChooser.activeButton;
	if (control.isPressed(37)) {
		CharacterChooser.activeButton++;
		if (CharacterChooser.activeButton + 1 > CharacterChooser.buttons.length) {
			CharacterChooser.activeButton = 0;
		}
	}
	else if (control.isPressed(39)) {
		CharacterChooser.activeButton--;
		if (CharacterChooser.activeButton < 0) {
			CharacterChooser.activeButton = CharacterChooser.buttons.length - 1;
		}
	}
	if (oldActiveButton !== CharacterChooser.activeButton) {
		CharacterChooser.resetUnactiveButton(oldActiveButton);
	}
};

CharacterChooser.update = function() {
	CharacterChooser.handleControls();
	CharacterChooser.updateActiveButton();
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