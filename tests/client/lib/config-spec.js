'use strict';

var Config = require('../../../src/client/lib/config.js');

describe('Config', function () {

	beforeEach(function() {
	});

	it('should be defined \'playerMoveSpeed\'', function() {
		expect(Config.playerMoveSpeed).toBeDefined();
	});

	it('should be defined \'playerAcceleration\'', function() {
		expect(Config.playerAcceleration).toBeDefined();
	});

	it('should be defined \'playerJumpSpeed\'', function() {
		expect(Config.playerJumpSpeed).toBeDefined();
	});

	it('should be defined \'playerSize\'', function() {
		expect(Config.playerSize).toBeDefined();
	});

	it('should be defined \'keyBindings\'', function() {
		expect(Config.keyBindings).toBeDefined();
	});
	
	it('should be defined \'canvasMaskColor\'', function() {
		expect(Config.canvasMaskColor).toBeDefined();
	});

	it('should define quickTapDuration', function() {
		expect(Config.quickTapDuration).toBeDefined();
	});

	it('should define progressBarPadding', function() {
		expect(Config.progressBarPadding).toBeDefined();
	});

	it('should define lifeBarWidthRatio', function() {
		expect(Config.lifeBarWidthRatio).toBeDefined();
	});

	it('should define energyBarWidthRatio', function() {
		expect(Config.energyBarWidthRatio).toBeDefined();
	});

	it('should define lifeBarHeight', function() {
		expect(Config.lifeBarHeight).toBeDefined();
	});

	it('should define energyBarHeight', function() {
		expect(Config.energyBarHeight).toBeDefined();
	});
});