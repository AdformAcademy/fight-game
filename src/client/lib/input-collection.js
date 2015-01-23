var Config = require('./config');

var InputCollection = {};

InputCollection.pressed = {};
InputCollection.pressTimes = {};
InputCollection.quickTaps = {};
InputCollection.keysPressed = {};

InputCollection.isDown = function (keyCode) {
	return InputCollection.pressed[keyCode];
};

InputCollection.quickTapped = function (keyCode) {
	var quickTapped = InputCollection.quickTaps[keyCode];
	if (quickTapped) {
		InputCollection.quickTaps[keyCode] = false;
	}
	return quickTapped;
};

InputCollection.isPressed = function (keyCode) {
	var isPressed = InputCollection.keysPressed[keyCode];
	if (isPressed) {
		InputCollection.keysPressed = false;
	}
	return isPressed;
};

InputCollection.onKeydown = function(event) {
	InputCollection.pressed[event.keyCode] = true;
};

InputCollection.onKeyPress = function(event) {
	InputCollection.keysPressed[event.keyCode] = true;
};

InputCollection.onKeyup = function(event) {
	var pastPressTime = InputCollection.pressTimes[event.keyCode];
	var currentPressTime = Date.now();
	if (pastPressTime !== undefined) {
		var interval = currentPressTime - pastPressTime;
		if (interval < Config.quickTapDuration) {
			InputCollection.quickTaps[event.keyCode] = true;
		}
	}
	InputCollection.pressTimes[event.keyCode] = currentPressTime;
	delete InputCollection.pressed[event.keyCode];
};

module.exports = InputCollection;