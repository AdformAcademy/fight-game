'use strict';

var InputProcessor = require('../../../src/client/lib/input-processor.js');
var InputCollection = require('../../../src/client/lib/input-collection.js');
var Config = require('../../../src/client/lib/config.js');

describe('InputProcessor', function () {

	var inputProcessor;
	var paramsMock;
	var blankInput = {
		id: 0,
		key: 0,
		jumpKey: false,
		punchKey: false,
		kickKey: false,
		punchCombo: false,
		kickCombo: false
	};

	var inputMock = {
		id: 0,
		key: Config.keyBindings.LEFT,
		jumpKey: true,
		punchKey: false,
		kickKey: false,
		punchCombo: true,
		kickCombo: false
	}

	beforeEach(function () {
		paramsMock = {
			player: {
				getLocation: function() {
					return {
						getX: function() {
							return 50;
						},
						getY: function() {
							return 250;
						}
					}
				}
			},
			opponent: {
				getLocation: function() {
					return {
						getX: function() {
							return 200;
						},
						getY: function() {
							return 250;
						}
					}
				}
			},
			canvasObj: {
				getWidth: function () {
					return 400;
				},
				getHeigth: function () {
					return 800;
				}
			}
		};
		inputProcessor = new InputProcessor(paramsMock);
	});

	it('should create blank input', function () {
		expect(InputProcessor.createBlankInput()).toBe(blankInput);
	});

	it('should assign 40 to \'input.key\'', function () {
		InputCollection.onKeydown({keyCode: Config.keyBindings.DOWN});
		InputCollection.onKeyup({keyCode: Config.keyBindings.DOWN});

		inputProcessor.processMovementInputs(blankInput);
		expect(blankInput.key).toBe(Config.keyBindings.DOWN);
	});

	it('should assign \'true\' to \'input.jumpKey\'', function () {
		InputCollection.onKeydown({keyCode: Config.keyBindings.JUMP});
		InputCollection.onKeyup({keyCode: Config.keyBindings.JUMP});

		inputProcessor.processActionInputs(blankInput);
		expect(blankInput.jumpKey).toBe(true);
	});

	it('should assign \'true\' to \'input.kickKey\'', function () {
		InputCollection.onKeydown({keyCode: Config.keyBindings.KICK});
		InputCollection.onKeyup({keyCode: Config.keyBindings.KICK});

		inputProcessor.processComboInputs(blankInput);
		expect(blankInput.kick).toBe(true);
	});

	it('should assign \'true\' to \'input.punchCombo\'', function () {
		InputCollection.onKeydown({keyCode: Config.keyBindings.PUNCH});
		InputCollection.onKeyup({keyCode: Config.keyBindings.PUNCH});
		InputCollection.onKeydown({keyCode: Config.keyBindings.PUNCH});
		InputCollection.onKeyup({keyCode: Config.keyBindings.PUNCH});

		inputProcessor.processComboInputs(blankInput);
		expect(blankInput.punchCombo).toBe(true);
	});

	it('should return given input', function () {
		InputCollection.onKeydown({keyCode: Config.keyBindings.LEFT});
		InputCollection.onKeydown({keyCode: Config.keyBindings.JUMP});
		InputCollection.onKeyup({keyCode: Config.keyBindings.LEFT});
		InputCollection.onKeyup({keyCode: Config.keyBindings.JUMP});
		InputCollection.onKeydown({keyCode: Config.keyBindings.PUNCH});
		InputCollection.onKeyup({keyCode: Config.keyBindings.PUNCH});
		InputCollection.onKeydown({keyCode: Config.keyBindings.PUNCH});
		InputCollection.onKeyup({keyCode: Config.keyBindings.PUNCH});

		var input = inputProcessor.processInputs();
		input.id = 0;
		expect(input).toBe(inputMock);
	});
});