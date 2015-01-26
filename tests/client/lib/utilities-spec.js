'use strict';

var Utilities = require('../../../src/client/lib/canvas/utilities.js');
var Point = require('../../../src/common/point.js');

describe('Utilities', function () {
	var body = $(document.body),
		container,
		canvas,
		objectWidthMock,
		utilities;

	beforeEach(function() {
		container = $('<div id="container"></div>');
		body.append(container);
		canvas = $('<canvas id="window" width="900" height="550"></canvas>');
		container.append(canvas);
		utilities = new Utilities();
	});
	
	it('should set location to {5, 6}', function () {
		var location = new Point(5, 6);
		var exp = new Point(5, 6);
		expect(utilities.toCanvasLocation(location)).toBe(exp);
	});

	it('should return middle', function () {
		var objectWidthMock = 900;
		expect(utilities.centerX(objectWidthMock)).toBe(0);
	});
});