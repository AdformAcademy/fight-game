'use strict';

var Point = require('../../../src/client/lib/canvas/point.js');

describe('Point', function () {

	var point;

	beforeEach(function() {
		point = new Point(1, 1);
	});

	it('should return point string', function() {
		expect(point.toString()).toBe('Point {x=1, y=1}');
	});
});