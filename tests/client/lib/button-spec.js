'use strict';

var Button = require('../../../src/client/lib/canvas/button.js');
var Point = require('../../../src/client/lib/canvas/point.js');

describe('Button', function () {

	var body = $(document.body),
		container,
		canvas,
		imageStringMock,
		button,
		imageMock;

	beforeEach(function() {
		container = $('<div id="container"></div>');
		body.append(container);
		canvas = $('<canvas id="window" width="900" height="550"></canvas>');
		container.append(canvas);
		imageStringMock = 'image-mock.png';
		button = new Button(imageStringMock);
	});

	it('should get default hover image', function() {
		expect(button.getHoverImage()).toBe(null);
	});

	it('should get width equal to 5', function() {
		button.setActiveImage({ width: 5 });
		expect(button.buttonWidth()).toBe(5);
	});

	it('should get height equal to 10', function() {
		button.setActiveImage({ height: 10 });
		expect(button.buttonHeight()).toBe(10);
	});

	it('should get default visible value', function() {
		expect(button.isVisible()).toBe(true);
	});

	it('should get default location', function() {
		expect(button.getLocation()).toBe(null);
	});

	it('should set image to imageMock', function() {
		button.setImage(imageMock);
		expect(button.getImage()).toBe(imageMock);
	});

	it('should set active image', function() {
		button.setActiveImage(imageMock);
		expect(button.getActiveImage()).toBe(imageMock);
	});

	it('should set visible value to false', function() {
		button.setVisible(false);
		expect(button.isVisible()).toBe(false);
	});

	it('should set location to point (1, 1)', function () {
		button.setLocation(new Point(1, 1));
		expect(button.getLocation().getX()).toBe(1);
		expect(button.getLocation().getY()).toBe(1);
	});

	it('should intersect with point (3, 3)', function() {
		button.setActiveImage({width: 5, height: 10 });
		button.setLocation(function () {
			return new Point(0, 0);
		});
		button.setVisible(true);
		expect(button.pointIntersects(new Point(3, 3))).toBe(true);
	});
	
	it('should not intersect with point (6, 7)', function() {
		button.setActiveImage({width: 5, height: 10 });
		button.setLocation(function () {
			return new Point(0, 0);
		});
		button.setVisible(true);
		expect(button.pointIntersects(new Point(6, 7))).toBe(false);
	});
})

