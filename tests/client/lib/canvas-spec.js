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

	it('should define getWidth method', function () {
		expect(canvas.getWidth).toBeDefined();
	});

	it('should define getHeight method', function () {
		expect(canvas.getHeight).toBeDefined();
	});

	it('should define getOffsetLeft method', function () {
		expect(canvas.getOffsetLeft).toBeDefined();
	});

	it('should define getOffsetTop method', function () {
		expect(canvas.getOffsetTop).toBeDefined();
	});

	it('should define clearCanvas method', function () {
		expect(canvas.clearCanvas).toBeDefined();
	});

	it('should define setGraphics method', function () {
		expect(canvas.setGraphics).toBeDefined();
	});

	it('should define getGraphics method', function () {
		expect(canvas.getGraphics).toBeDefined();
	});

	it('should define drawGraphics method', function () {
		expect(canvas.drawGraphics).toBeDefined();
	});

	it('should define drawBackground method', function () {
		expect(canvas.drawBackground).toBeDefined();
	});

	it('should define draw method', function () {
		expect(canvas.draw).toBeDefined();
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

	it ('should get default \'graphics\' value', function() {
		expect(canvas.getGraphics()).toBe(null);
	});

    it ('should set graphics', function() {
        canvas.setGraphics(graphics);
        expect(canvas.getGraphics()).toBe(graphics);
    });

});