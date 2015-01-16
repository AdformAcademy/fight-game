'use strict';

var Player = require('../../../src/client/lib/player');
var Point = require('../../../src/common/point');

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

		locationMock = new Point(0, 1);
		spritesheetMock = {};
		player = new Player(locationMock, spritesheetMock);
	});

	afterEach(function() {
		body.empty();
	});

	it('should get default X coordinate', function() {
		expect(player.getX()).toBe(0);
	});

	it('should set X coordinate to 5', function() {
		player.setX(5);
		expect(player.getX()).toBe(5);
	});

	it('should get default Y coordinate', function() {
		expect(player.getY()).toBe(1);
	});

	it('should set Y coordinate to 5', function() {
		player.setY(5);
		expect(player.getY()).toBe(5);
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

	it('should get default usingCombo value', function () {
		expect(player.usingCombo()).toBe(false);
	});

	it('should set player z value to 3', function() {
		player.setZ(3);
		expect(player.getZ()).toBe(3);
	});

	it('should set player speedZ value to 5', function() {
		player.setSpeedZ(5);
		expect(player.getSpeedZ()).toBe(5);
	});

	it('should set player jumpstate to 1', function() {
		player.setJumpState(1);
		expect(player.isJumping()).toBe(true);
	});

	it('should set player punchstate to 1', function() {
		player.setPunchState(1);
		expect(player.isPunching()).toBe(true);
	});

	it('should set player depth to 0', function() {
		player.setDepth(0);
		expect(player.getDepth()).toBe(0);
	});

	it('should not set player\'s depth higher than 1', function() {
		player.setDepth(2);
		expect(player.getDepth()).toBe(0);
	});

	it('should not set player\'s depth less than 0', function() {
		player.setDepth(-5);
		expect(player.getDepth()).toBe(0);
	});

	it('should set player defending state to true', function() {
		player.setDefending(true);
		expect(player.isDefending()).toBe(true);
	});

	it('should set player using combo state to 1', function() {
		player.setUsingCombo(1)
		expect(player.usingCombo()).toBe(true);
	});
});