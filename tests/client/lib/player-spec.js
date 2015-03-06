'use strict';

var Player = require('../../../src/client/lib/player');
var Point = require('../../../src/common/point');

describe('Player', function () {

	var body = $(document.body),
		container,
		canvas,
		locationMock,
		spritesheetMock,
		player,
		mockLifeBar,
		mockEnergyBar,
		mockEnergyCosts,
		mockSpeed;

	beforeEach(function() {
		container = $('<div id="container"></div>');
		body.append(container);
		canvas = $('<canvas id="window" width="900" height="550"></canvas>');
		container.append(canvas);

		mockEnergyCosts = {
			'punch': 7,
			'kick': 8,
			'jump': 5
		};
		mockSpeed = {
			'punch': 250,
			'kick': 375,
			'punchCombo': 833,
			'kickCombo': 1000
		};
		mockLifeBar = {};
		mockEnergyBar = {
			currentValue: 100,
			getCurrentValue: function () {
				return this.currentValue;
			}
		};
		spritesheetMock = {};
		player = new Player({
			location: 0,
			z: 0,
			spriteSheet: spritesheetMock,
			lifeBar: mockLifeBar,
			energyBar: mockEnergyBar,
			energyCosts: mockEnergyCosts,
			speed: mockSpeed
		});
	});

	afterEach(function() {
		body.empty();
	});
	
	it('should define getSpeed method', function () {
		expect(player.getSpeed).toBeDefined();
	});

	it('should define setSpeed method', function () {
		expect(player.setSpeed).toBeDefined();
	});

	it('should get value 1000', function() {
		var speed = {
			'punch': 250,
			'kick': 375,
			'punchCombo': 833,
			'kickCombo': 1000
		};
		player.setSpeed(speed);
		expect(player.getSpeed('kickCombo')).toBe(1000);
	});

	it('should define getSpriteSheet method', function () {
		expect(player.getSpriteSheet).toBeDefined();
	});

	it('should define setSpriteSheet method', function () {
		expect(player.setSpriteSheet).toBeDefined();
	});

	it('should define setDepth method', function () {
		expect(player.setDepth).toBeDefined();
	});

	it('should define getDepth method', function () {
		expect(player.getDepth).toBeDefined();
	});

	it('should define getLifeBar method', function () {
		expect(player.getLifeBar).toBeDefined();
	});

	it('should define getEnergyBar method', function () {
		expect(player.getEnergyBar).toBeDefined();
	});

	it('should define hasEnoughEnergy method', function () {
		expect(player.hasEnoughEnergy).toBeDefined();
	});

	it('should define setLifeBar method', function () {
		expect(player.setLifeBar).toBeDefined();
	});

	it('should define setEnergyBar method', function () {
		expect(player.setEnergyBar).toBeDefined();
	});

	it('should define update method', function () {
		expect(player.update).toBeDefined();
	});

	it('should define draw method', function () {
		expect(player.draw).toBeDefined();
	});

	it('should get default X coordinate', function() {
		expect(player.getX()).toBe(0);
	});

	it('should set X coordinate to 5', function() {
		player.setX(5);
		expect(player.getX()).toBe(5);
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
		player.setJumping(true);
		expect(player.isJumping()).toBe(true);
	});

	it('should set player punchstate to 1', function() {
		player.setPunching(true);
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
		player.setUsingCombo(true);
		expect(player.usingCombo()).toBe(true);
	});

	it('should get default lifebar', function () {
		expect(player.getLifeBar()).toBe(mockLifeBar);
	});

	it('should set custom lifebar', function () {
		var customLifeBar = {};
		player.setLifeBar(customLifeBar);
		expect(player.getLifeBar()).toBe(customLifeBar);
	});

	it('should get default energyBar', function () {
		expect(player.getEnergyBar()).toBe(mockEnergyBar);
	});

	it('should set custom energyBar', function () {
		var customEnergyBar = {};
		player.setEnergyBar(customEnergyBar);
		expect(player.getEnergyBar()).toBe(customEnergyBar);
	});

	it('should have enough energy on punch action', function () {
		expect(player.hasEnoughEnergy('punch')).toBe(true);
	});

	it('should not have enough energy on punch action', function () {
		var energyBar = player.getEnergyBar();
		energyBar.currentValue -= 95;
		expect(player.hasEnoughEnergy('punch')).toBe(false);
	});
});