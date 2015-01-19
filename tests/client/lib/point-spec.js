'use strict';

var Point = require('../../../src/common/point.js');

describe('Point', function () {

	var point;

	beforeEach(function() {
		point = new Point(1, 1);
	});

	it('should get X coordinate to 1', function () {
		expect(point.getX()).toBe(1);
	});

	it('should get Y coordinate to 1', function () {
		expect(point.getY()).toBe(1);
	});

	it('should set X coordinate to 5', function () {
		point.setX(5);
		expect(point.getX()).toBe(5);
	});

	it('should set Y coordinate to 5', function () {
		point.setY(5);
		expect(point.getY()).toBe(5);
	});

	it('should return point string', function() {
		expect(point.toString()).toBe('Point {x=1, y=1}');
	});
});