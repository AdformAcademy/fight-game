'use strict'

var InputCollection = require('../../../src/client/lib/input-collection.js');
var Config = require('../../../src/client/lib/config.js');

describe ('InputCollection', function () {

	beforeEach(function () {
		InputCollection.pressed = {};
		InputCollection.pressTimes = {};
		InputCollection.quickTaps = {};
		InputCollection.keysPressed = {};
	});

	it('should set true for pressed key', function () {
		InputCollection.onKeydown({keyCode: Config.keyBindings.LEFT});
		expect(InputCollection.pressed[Config.keyBindings.LEFT]).toBe(true);
	});

	it('should set true for pressed key', function () {
		InputCollection.onKeydown({keyCode: Config.keyBindings.LEFT});
		InputCollection.onKeyup({keyCode: Config.keyBindings.LEFT});
		expect(InputCollection.keysPressed[Config.keyBindings.LEFT]).toBe(true);
	});

	it('should return true', function () {
		InputCollection.onKeydown({keyCode: Config.keyBindings.LEFT});
		expect(InputCollection.isDown(Config.keyBindings.LEFT)).toBe(true);
	});

	it('should return true', function () {
		InputCollection.onKeydown({keyCode: Config.keyBindings.PUNCH});
		InputCollection.onKeyup({keyCode: Config.keyBindings.PUNCH});
		InputCollection.onKeydown({keyCode: Config.keyBindings.PUNCH});
		InputCollection.onKeyup({keyCode: Config.keyBindings.PUNCH});

		expect(InputCollection.quickTapped(Config.keyBindings.PUNCH)).toBe(true);
	});

	it('should return true', function () {
		InputCollection.onKeydown({keyCode: Config.keyBindings.JUMP});
		InputCollection.onKeyup({keyCode: Config.keyBindings.JUMP});

		expect(InputCollection.isPressed(Config.keyBindings.JUMP)).toBe(true);
	});
});