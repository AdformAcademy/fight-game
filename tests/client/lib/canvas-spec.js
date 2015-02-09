'use strict';

var Canvas = require('../../../src/client/lib/canvas/canvas.js');
var Point = require('../../../src/common/point.js');
var Config = require('../../../src/client/lib/config.js');

describe('Canvas', function () {
	var body = $(document.body),
	graphics,
	updateInterval;
	
	var canvas;

	beforeEach(function() {
		canvas = new Canvas('#window');
	});

	it ('should get default \'width\' value', function() {
		expect(canvas.getWidth()).toBe(900);
	});

	it ('should get default \'height\' value', function() {
		expect(canvas.getHeight()).toBe(550);
	});

	it ('should get default \'offset left\' value', function() {
		expect(canvas.getOffsetLeft()).toBe(8);
	});

	it ('should get default \'offset top\' value', function() {
		expect(canvas.getOffsetTop()).toBe(8);
	});

	it ('should get default \'update interval\' value', function() {
		expect(canvas.getUpdateInterval()).toBe(30);
	});

	it ('should get default \'graphics\' value', function() {
		expect(canvas.getGraphics()).toBe(null);
	});

	it ('should clear canvas', function () {
		expect(canvas.clearCanvas(0, 0, 100, 100)).toBe(undefined);
	});

    it ('should set update interval', function() {
        canvas.setUpdateInterval(updateInterval);
        expect(canvas.getUpdateInterval()).toBe(updateInterval);
    });

    it ('should set graphics', function() {
        canvas.setGraphics(graphics);
        expect(canvas.getGraphics()).toBe(graphics);
    });

});