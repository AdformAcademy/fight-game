'use strict';

var Player = require('../../../src/client/lib/player.js');

describe('Player', function () {

	var body = $(document.body),
		container,
		canvas,
		locationMock,
		spritesheetMock,
		player;

	beforeEach(function() {
		container = $('<div id="container"></div>');
		body.append(container);
		canvas = $('<canvas id="window" width="900" height="550"></canvas>');
		container.append(canvas);

		locationMock = {};
		spritesheetMock = {};
		player = new Player(locationMock, spritesheetMock);
	});

	afterEach(function() {
		body.empty();
	});

	it('should get default location', function() {
		expect(player.getLocation()).toBe(locationMock);
	});

	it('should get default spritesheet', function() {
		expect(player.getSpriteSheet()).toBe(spritesheetMock);
	});

	it('should get default jumping value', function() {
		expect(player.isJumping()).toBe(false);
	});

	it('should get default punching value', function() {
		expect(player.isPunching()).toBe(false);
	});

	it('should get default z value', function() {
		expect(player.getZ()).toBe(0);
	});

	it('should get default speedZ value', function() {
		expect(player.getSpeedZ()).toBe(0);
	});

	it('should get default depth value', function() {
		expect(player.getDepth()).toBe(0);
	});

	it('should set player z value to 3', function() {
		player.setZ(3);
		expect(player.getZ()).toBe(3);
	});
});