'use strict';

var Pattern = require('../../../src/client/lib/canvas/pattern.js');

describe('Pattern', function () {

	var pattern;

	beforeEach(function() {
		pattern = new Pattern(function () {
			return 400;
		}, 5.5, 'img/test.png');
	});

	it('should define getY method', function () {
		expect(pattern.getY).toBeDefined();
	});

	it('should define setY method', function () {
		expect(pattern.setY).toBeDefined();
	});

	it('should define getSpeed method', function () {
		expect(pattern.getSpeed).toBeDefined();
	});

	it('should define setSpeed method', function () {
		expect(pattern.setSpeed).toBeDefined();
	});

	it('should define draw method', function () {
		expect(pattern.draw).toBeDefined();
	});

	it('should define moveLeft method', function () {
		expect(pattern.moveLeft).toBeDefined();
	});

	it('should define moveRight method', function () {
		expect(pattern.moveRight).toBeDefined();
	});

	it('should get default y value', function () {
		expect(pattern.getY()).toBe(400);
	});

	it('should set custom y value', function () {
		pattern.setY(function () {
			return 300;
		});
		expect(pattern.getY()).toBe(300);
	});

	it('should not set custom y value because value is not a function', function () {
		pattern.setY(600);
		expect(pattern.getY()).toBe(400);
	});

	it('should get default speed value', function () {
		expect(pattern.getSpeed()).toBe(5.5);
	});

	it('should set custom speed value', function () {
		pattern.setSpeed(4.2);
		expect(pattern.getSpeed()).toBe(4.2);
	});

	it('should move pattern to left', function () {
		pattern.moveLeft();
		expect(pattern.x).toBe(-5.5);

		pattern.moveLeft();
		expect(pattern.x).toBe(-11);

		pattern.setSpeed(3.1);
		pattern.moveLeft();
		expect(pattern.x).toBe(-14.1);
	});

	it('should move pattern to right', function () {
		pattern.moveRight();
		expect(pattern.x).toBe(5.5);

		pattern.moveRight();
		expect(pattern.x).toBe(11);

		pattern.setSpeed(3.1);
		pattern.moveRight();
		expect(pattern.x).toBe(14.1);
	});
});