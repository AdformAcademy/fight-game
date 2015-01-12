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
	
	it('should be defined \'canvasUpdateInterval\'', function() {
		expect(Config.canvasUpdateInterval).toBeDefined();
	});
	
	it('should be defined \'canvasMaskColor\'', function() {
		expect(Config.canvasMaskColor).toBeDefined();
	});
});