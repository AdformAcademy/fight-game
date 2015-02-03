'use strict';

var SpriteSheet = require('../../../src/client/lib/canvas/spritesheet');

describe('SpriteSheet', function () {

	var body = $(document.body),
		container,
		canvas,
		locationMock,
		spriteSheet,
		mockParams,
		mockImage,
		mockData;

	beforeEach(function() {
		container = $('<div id="container"></div>');
		body.append(container);
		canvas = $('<canvas id="window" width="900" height="550"></canvas>');
		container.append(canvas);

		mockImage = {};

		mockData = {
			"spriteSheetImage": "character1.png",
			"spriteDimensions": {
				"width": 19840,
				"height": 224,
				"frameWidth": 320
			},
			"animations": {
				"standAnimation": {
					"name": "standAnimation",
					"startFrame": 29,
					"frames": 3,
					"speed": 1.0,
					"order": "asc"
				},
				"moveAnimation": {
					"name": "moveAnimation",
					"startFrame": 8,
					"frames": 6,
					"speed": 1.0,
					"order": "desc"
				},
				"jumpAnimation": {
					"name": "jumpAnimation",
					"startFrame": 2,
					"frames": 6,
					"speed": 0.25,
					"order": "asc"
				},
				"punchAnimation1": {
					"name": "punchAnimation1",
					"startFrame": 24,
					"frames": 2,
					"speed": 0.2,
					"order": "asc"
				},
				"punchAnimation2": {
					"name": "punchAnimation2",
					"startFrame": 26,
					"frames": 2,
					"speed": 0.2,
					"order": "asc"
				},
				"defendAnimation": {
					"name": "defendAnimation",
					"startFrame": 55,
					"frames": 1,
					"speed": 0.2,
					"order": "asc"
				},
				"damageAnimation": {
					"name": "damageAnimation",
					"startFrame": 0,
					"frames": 1,
					"speed": 10.0,
					"order": "asc"
				},
				"kickAnimation": {
					"name": "kickAnimation",
					"startFrame": 44,
					"frames": 5,
					"speed": 0.4,
					"order": "desc"
				},
				"jumpKickAnimation": {
					"name": "jumpKickAnimation",
					"startFrame": 32,
					"frames": 4,
					"speed": 0.3,
					"order": "asc"
				},
				"jumpPunchAnimation": {
					"name": "jumpPunchAnimation",
					"startFrame": 42,
					"frames": 2,
					"speed": 0.2,
					"order": "asc"
				},
				"runningAnimation": {
					"name": "runningAnimation",
					"startFrame": 36,
					"frames": 6,
					"speed": 0.35,
					"order": "asc"
				},
				"punchComboAnimation": {
					"name": "punchComboAnimation",
					"startFrame": 49,
					"frames": 6,
					"speed": 0.5,
					"order": "asc"
				},
				"kickComboAnimation": {
					"name": "kickComboAnimation",
					"startFrame": 56,
					"frames": 6,
					"speed": 0.3,
					"order": "asc"
				},
				"fatalityAnimation": {
					"name": "fatalityAnimation",
					"startFrame": 63,
					"frames": 10,
					"speed": 0.3,
					"order": "asc"
				},
				"beatenAnimation": {
					"name": "beatenAnimation",
					"startFrame": 74,
					"frames": 6,
					"speed": 0.3,
					"order": "desc"
				},
				"introAnimation": {
					"name": "introAnimation",
					"startFrame": 74,
					"frames": 6,
					"speed": 0.3,
					"order": "desc"
				},
			},
			"defaultAnimation": "standAnimation"
		};

		mockParams = {
			image: mockImage,
			data: mockData
		};

		spriteSheet = new SpriteSheet(mockParams);
	});

	afterEach(function() {
		body.empty();
	});

	it('should define getCurrentFrame method', function () {
		expect(spriteSheet.getCurrentFrame).toBeDefined();
	});

	it('should define setCurrentFrame method', function () {
		expect(spriteSheet.setCurrentFrame).toBeDefined();
	});

	it('should define getCurrentAnimation method', function () {
		expect(spriteSheet.getCurrentAnimation).toBeDefined();
	});

	it('should define isFlipped method', function () {
		expect(spriteSheet.isFlipped).toBeDefined();
	});

	it('should define isLastFrame method', function () {
		expect(spriteSheet.isLastFrame).toBeDefined();
	});

	it('should define isLastFrame method', function () {
		expect(spriteSheet.isLastFrame).toBeDefined();
	});

	it('should define setActiveAnimation method', function () {
		expect(spriteSheet.setActiveAnimation).toBeDefined();
	});

	it('should define getAnimationOrder method', function () {
		expect(spriteSheet.getAnimationOrder).toBeDefined();
	});

	it('should define setAnimationOrder method', function () {
		expect(spriteSheet.setAnimationOrder).toBeDefined();
	});

	it('should define flipAnimation method', function () {
		expect(spriteSheet.flipAnimation).toBeDefined();
	});

	it('should define getAnimation method', function () {
		expect(spriteSheet.getAnimation).toBeDefined();
	});

	it('should define update method', function () {
		expect(spriteSheet.update).toBeDefined();
	});

	it('should define draw method', function () {
		expect(spriteSheet.draw).toBeDefined();
	});

	it('should define getSpriteSheetHeight method', function () {
		expect(spriteSheet.getSpriteSheetHeight).toBeDefined();
	});

	it('should get default startFrame', function () {
		expect(spriteSheet.getCurrentFrame()).toBe(29);
	});

	it('should set currentFrame to 30', function () {
		spriteSheet.setCurrentFrame(30);
		expect(spriteSheet.getCurrentFrame()).toBe(30);
	});

	it('should get default spritesheet height', function () {
		expect(spriteSheet.getSpriteSheetHeight()).toBe(224);
	});

	it('should get default animation name', function () {
		expect(spriteSheet.getCurrentAnimation()).toBe('standAnimation');
	});

	it('should get default flipped state', function () {
		expect(spriteSheet.isFlipped()).toBe(false);
	});

	it('should change animation flip state', function () {
		spriteSheet.flipAnimation();
		expect(spriteSheet.isFlipped()).toBe(true);
	});

	it('should check if current frame is lastFrame', function () {
		spriteSheet.setCurrentFrame(32);
		expect(spriteSheet.isLastFrame()).toBe(true);
	});

	it('should check if current frame is not lastFrame', function () {
		spriteSheet.setCurrentFrame(30);
		expect(spriteSheet.isLastFrame()).toBe(false);
	});

	it('should change active animation', function () {
		spriteSheet.setActiveAnimation('jumpAnimation');
		expect(spriteSheet.getCurrentAnimation()).toBe('jumpAnimation');
		expect(spriteSheet.getCurrentFrame()).toBe(2);
		expect(spriteSheet.getAnimationOrder()).toBe('asc');
	});

	it('should get animation order', function () {
		expect(spriteSheet.getAnimationOrder()).toBe('asc');
	});

	it('should set animation order', function () {
		spriteSheet.setAnimationOrder('desc');
		expect(spriteSheet.getAnimationOrder()).toBe('desc');
	});

	it('should get animation', function () {
		expect(spriteSheet.getAnimation('moveAnimation'))
			.toBe(mockData.animations.moveAnimation);
	});

	it('should update animation', function () {
		spriteSheet.update();
		expect(spriteSheet.getCurrentFrame()).toBe(30);
		spriteSheet.update();
		expect(spriteSheet.getCurrentFrame()).toBe(31);
		spriteSheet.update();
		expect(spriteSheet.getCurrentFrame()).toBe(32);
		spriteSheet.update();
		expect(spriteSheet.getCurrentFrame()).toBe(29);
	});

	it('should update animation in reverse order', function () {
		spriteSheet.setActiveAnimation('moveAnimation');
		expect(spriteSheet.getCurrentFrame()).toBe(13);
		spriteSheet.update();
		expect(spriteSheet.getCurrentFrame()).toBe(12);
		spriteSheet.update();
		expect(spriteSheet.getCurrentFrame()).toBe(11);
		spriteSheet.update();
		expect(spriteSheet.getCurrentFrame()).toBe(10);
		spriteSheet.update();
		expect(spriteSheet.getCurrentFrame()).toBe(9);
	});

});