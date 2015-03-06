'use strict';

var UpdateHandler = require('../../../src/client/lib/utils/update-handler.js');

describe('UpdateHandler', function () {

	var updatateHandler;

	var property;

	beforeEach(function() {
		updatateHandler = new UpdateHandler(function () {
			property += 1;
		}, 100);
	});
	
	it('should define start method', function () {
		expect(updatateHandler.start).toBeDefined();
	});

	it('should define stop method', function () {
		expect(updatateHandler.stop).toBeDefined();
	});

	it('should start update handler', function () {
		property = 0;
		jasmine.clock().install();
		expect(property).toBe(0);
		updatateHandler.start();
 		jasmine.clock().tick(500);
 		expect(property).toBe(5);
 		jasmine.clock().tick(200);
 		expect(property).toBe(7);
 		updatateHandler.stop();
	});

	it('should stop update handler', function () {
		property = 0;
		jasmine.clock().install();
		expect(property).toBe(0);
		updatateHandler.start();
 		jasmine.clock().tick(500);
 		expect(property).toBe(5);
 		updatateHandler.stop();
 		jasmine.clock().tick(500);
 		expect(property).toBe(5);
	});
});