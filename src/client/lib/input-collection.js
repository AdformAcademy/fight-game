var Config = require('./config');

var InputCollection = function () {};

InputCollection.pressed = {};
InputCollection.pressTimes = {};
InputCollection.quickTaps = {};

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

InputCollection.onKeydown = function(event) {
	InputCollection.pressed[event.keyCode] = true;
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