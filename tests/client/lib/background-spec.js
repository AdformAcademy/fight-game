'use strict';

var Background = require('../../../src/client/lib/canvas/background.js');
var Point = require('../../../src/common/point.js');

describe('Background', function () {
	var body = $(document.body),
		container,
		canvas,
		imageStringMock,
		background;

	beforeEach(function() {
		container = $('<div id="container"></div>');
		body.append(container);
		canvas = $('<canvas id="window" width="900" height="550"></canvas>');
		container.append(canvas);
		imageStringMock = 'image-mock.png';
		background = new Background(imageStringMock);
	});

	afterEach(function() {
		body.empty();
	});

	it('should get default visibility value to be true', function () {
		expect(background.isVisible()).toBe(true);
	});

	it('should set visibility to false', function () {
		background.setVisible(false)
		expect(background.isVisible()).toBe(false);
	});

	it('should get default location to be {0, 0}', function () {
		expect(background.getLocation().getX()).toBe(0);
		expect(background.getLocation().getY()).toBe(0);
	});

	it('should set location to {5, 6}', function () {
		var location = new Point(5, 6);
		background.setLocation(location);
		expect(background.getLocation().getX()).toBe(5);
		expect(background.getLocation().getY()).toBe(6);
	});

	it('should set Image object', function () {
		var imageMock = new Image();
		background.setImage(imageMock);
		expect(background.getImage()).toBe(imageMock);
	});
});