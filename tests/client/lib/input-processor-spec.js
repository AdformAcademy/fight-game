'use strict';

var InputProcessor = require('../../../src/client/lib/input-processor.js');
var InputCollection = require('../../../src/client/lib/input-collection.js');
var Config = require('../../../src/client/lib/config.js');
var Player = require('../../../src/client/lib/player.js');
var Point = require('../../../src/common/point.js');
var EnergyBar = require('../../../src/client/lib/canvas/energy-bar.js');
var App = require('../../../src/client/app.js');

describe('InputProcessor', function () {

	var inputProcessor;
	var paramsMock;
	var playerParamsMock = {
		location: new Point(250, 250),
		spriteSheet: null,
		lifeBar: null,
		energyBar: {getCurrentValue: function () {
			return 1000;
		}},
		energyCosts: {
			kick: 0,
			punch: 0,
			kickCombo: 0,
			punchCombo: 0,
			jump: 0
		}
	};
	var opponentParamsMock = {
		location: new Point(500, 250),
		spriteSheet: null,
		lifeBar: null,
		energyBar: {getCurrentValue: function () {
			return 1000;
		}},
		energyCosts: {
			kick: 0,
			punch: 0,
			kickCombo: 0,
			punchCombo: 0,
			jump: 0
		}
	};
	var blankInput = {
		id: 0,
		key: 0,
		jumpKey: false,
		punchKey: false,
		kickKey: false,
		punchCombo: false,
		kickCombo: false
	};

	beforeEach(function () {
		paramsMock = {
			player: new Player(playerParamsMock),
			opponent: new Player(opponentParamsMock),
			canvasObj: {
				getWidth: function () {
					return 2000;
				},
				getHeigth: function () {
					return 2000;
				}
			}
		};
		inputProcessor = new InputProcessor(paramsMock);
		InputCollection.pressed = {};
		InputCollection.pressTimes = {};
		InputCollection.quickTaps = {};
		InputCollection.keysPressed = {};
		App.physics = {
			hit: function () {},
			jump: function () {}
		}
	});

	it('should create blank input', function () {
		var input = inputProcessor.createBlankInput();
		expect(input.key).toBe(blankInput.key);
		expect(input.kickKey).toBe(blankInput.kickKey);
		expect(input.punchKey).toBe(blankInput.punchKey);
		expect(input.kickCombo).toBe(blankInput.kickCombo);
		expect(input.punchCombo).toBe(blankInput.punchCombo);
		expect(input.jumpKey).toBe(blankInput.jumpKey);
	});

	it('should assign 40 to \'input.key\'', function () {
		InputCollection.onKeydown({keyCode: Config.keyBindings.DOWN});
		inputProcessor.processMovementInputs(blankInput);
		expect(blankInput.key).toBe(Config.keyBindings.DOWN);
	});

	it('should assign \'true\' to \'input.jumpKey\'', function () {
		InputCollection.onKeydown({keyCode: Config.keyBindings.JUMP});

		inputProcessor.processActionInputs(blankInput);
		expect(blankInput.jumpKey).toBe(true);
	});

	it('should assign \'true\' to \'input.kickKey\'', function () {
		InputCollection.onKeydown({keyCode: Config.keyBindings.KICK});

		inputProcessor.processComboInputs(blankInput);
		expect(blankInput.kickKey).toBe(true);
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
		InputCollection.onKeydown({keyCode: Config.keyBindings.PUNCH});

		var input = inputProcessor.processInputs();
		var inputMock = {
			id: 0,
			key: Config.keyBindings.LEFT,
			jumpKey: true,
			punchKey: true,
			kickKey: false,
			punchCombo: false,
			kickCombo: false
		}

		expect(input.key).toBe(inputMock.key);
		expect(input.punchKey).toBe(inputMock.punchKey);
		expect(input.kickKey).toBe(inputMock.kickKey);
		expect(input.punchCombo).toBe(inputMock.punchCombo);
		expect(input.kickCombo).toBe(inputMock.kickCombo);
		expect(input.jumpKey).toBe(inputMock.jumpKey);
	});
});