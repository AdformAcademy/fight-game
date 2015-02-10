'use strict';

var Button = require('../../../src/client/lib/canvas/button.js');
var Point = require('../../../src/common/point.js');

describe('Button', function () {

	var body = $(document.body),
		container,
		canvas,
		imageStringMock,
		button,
		imageMock,
		mockLocation;

	beforeEach(function() {
		container = $('<div id="container"></div>');
		body.append(container);
		canvas = $('<canvas id="window" width="900" height="550"></canvas>');
		container.append(canvas);
		imageStringMock = './img/start_button.png';
		mockLocation = {
			getX: function () {
				return 0;
			},
			getY: function () {
				return 0;
			}
		};
		button = new Button({
			image: imageStringMock,
			useSpriteSheet: false,
			location: mockLocation
		});
	});

	it('should define getId method', function () {
		expect(button.getId).toBeDefined();
	});

	it('should define setId method', function () {
		expect(button.setId).toBeDefined();
	});

	it('should define getImage method', function () {
		expect(button.getImage).toBeDefined();
	});

	it('should define setImage method', function () {
		expect(button.setImage).toBeDefined();
	});

	it('should define getHoverImage method', function () {
		expect(button.getHoverImage).toBeDefined();
	});

	it('should define getActiveImage method', function () {
		expect(button.getActiveImage).toBeDefined();
	});

	it('should define setActiveImage method', function () {
		expect(button.setActiveImage).toBeDefined();
	});

	it('should define buttonWidth method', function () {
		expect(button.buttonWidth).toBeDefined();
	});

	it('should define buttonHeight method', function () {
		expect(button.buttonHeight).toBeDefined();
	});

	it('should define setHoverImage method', function () {
		expect(button.setHoverImage).toBeDefined();
	});

	it('should define isVisible method', function () {
		expect(button.isVisible).toBeDefined();
	});

	it('should define setVisible method', function () {
		expect(button.setVisible).toBeDefined();
	});

	it('should define getLocation method', function () {
		expect(button.getLocation).toBeDefined();
	});

	it('should define setLocation method', function () {
		expect(button.setLocation).toBeDefined();
	});

	it('should define setSpriteSheet method', function () {
		expect(button.setSpriteSheet).toBeDefined();
	});

	it('should define getSpriteSheet method', function () {
		expect(button.getSpriteSheet).toBeDefined();
	});

	it('should define setUsingSpriteSheet method', function () {
		expect(button.setUsingSpriteSheet).toBeDefined();
	});

	it('should define usingSpriteSheet method', function () {
		expect(button.usingSpriteSheet).toBeDefined();
	});

	it('should define setDrawBorder method', function () {
		expect(button.setDrawBorder).toBeDefined();
	});

	it('should define borderIsDrawing method', function () {
		expect(button.borderIsDrawing).toBeDefined();
	});

	it('should define getBorderWidth method', function () {
		expect(button.getBorderWidth).toBeDefined();
	});

	it('should define setBorderWidth method', function () {
		expect(button.setBorderWidth).toBeDefined();
	});

	it('should define getBorderColor method', function () {
		expect(button.getBorderColor).toBeDefined();
	});

	it('should define setBorderColor method', function () {
		expect(button.setBorderColor).toBeDefined();
	});

	it('should define drawButton method', function () {
		expect(button.drawButton).toBeDefined();
	});

	it('should define pointIntersects method', function () {
		expect(button.pointIntersects).toBeDefined();
	});

	it('should define executeClick method', function () {
		expect(button.executeClick).toBeDefined();
	});

	it('should define executeMouseOver method', function () {
		expect(button.executeMouseOver).toBeDefined();
	});

	it('should define executeMouseLeave method', function () {
		expect(button.executeMouseLeave).toBeDefined();
	});

	it('should define onClick method', function () {
		expect(button.onClick).toBeDefined();
	});

	it('should define mouseOver method', function () {
		expect(button.mouseOver).toBeDefined();
	});

	it('should define mouseLeave method', function () {
		expect(button.mouseLeave).toBeDefined();
	});

	it('should define hover method', function () {
		expect(button.hover).toBeDefined();
	});

	it('should define hoverLeave method', function () {
		expect(button.hoverLeave).toBeDefined();
	});

	it('should define dispose method', function () {
		expect(button.dispose).toBeDefined();
	});

	it('should get default id value', function () {
		expect(button.getId()).toBe(null);
	});

	it('should set custom id value', function () {
		button.setId(8);
		expect(button.getId()).toBe(8);
	});

	it('should get default spritesheet value', function () {
		expect(button.getSpriteSheet()).toBe(null);
	});

	it('should set custom spritesheet value', function () {
		var mockSpriteSheet = {};
		button.setSpriteSheet(mockSpriteSheet);
		expect(button.getSpriteSheet()).toBe(mockSpriteSheet);
	});

	it('should get default using spritesheet state', function () {
		expect(button.usingSpriteSheet()).toBe(false);
	});

	it('should set using spritesheet state to true', function () {
		button.setUsingSpriteSheet(true);
		expect(button.usingSpriteSheet()).toBe(true);
	});

	it('should get default drawBorder state', function () {
		expect(button.borderIsDrawing()).toBe(null);
	});

	it('should set drawBorder to true', function () {
		button.setDrawBorder(true);
		expect(button.borderIsDrawing()).toBe(true);
	});

	it('should get default borderWidth value', function () {
		expect(button.getBorderWidth()).toBe(null);
	});

	it('should set custom borderWidth value', function () {
		button.setBorderWidth(10);
		expect(button.getBorderWidth()).toBe(10);
	});

	it('should not set custom borderWidth value because it\'s not a number', function () {
		button.setBorderWidth(15);
		button.setBorderWidth('hello');
		expect(button.getBorderWidth()).toBe(15);
	});

	it('should get default borderColor value', function () {
		expect(button.getBorderColor()).toBe('black');
	});

	it('should set custom borderColor value', function () {
		button.setBorderColor('#FFF000')
		expect(button.getBorderColor()).toBe('#FFF000');
	});

	it('should get default hover image', function() {
		expect(button.getHoverImage()).toBeDefined();
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
		expect(button.getLocation()).toBe(mockLocation);
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

