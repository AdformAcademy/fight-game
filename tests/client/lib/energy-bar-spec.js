'use strict';

var body = $(document.body),
	container = $('<div id="container"></div>'),
	canvas = $('<canvas id="window" width="900" height="550"></canvas>');

body.append(container);
container.append(canvas);

var ProgressBar = require('../../../src/client/lib/canvas/progress-bar.js');
var EnergyBar = require('../../../src/client/lib/canvas/energy-bar.js');

describe('EnergyBar', function () {

	var energyBar,
		paramsMock,
		body;

	beforeEach(function () {
		container = $('<div id="container"></div>');
		body.append(container);
		canvas = $('<canvas id="window" width="900" height="550"></canvas>');
		container.append(canvas);
		paramsMock = {
			location: 'locationMock',
			width: 1,
			heigth: 1,
			currentValue: 2,
			maxValue: 4
		};
		energyBar = new EnergyBar(paramsMock);
	});

	it('should be defined \'store\'', function () {
		expect(energyBar.store).toBeDefined();
	});

	it('should be defined \'animateChange\'', function () {
		expect(energyBar.animateChange).toBeDefined();
	});

	it('should be defined \'update\'', function () {
		expect(energyBar.update).toBeDefined();
	});

	it('should be defined \'dispose\'', function () {
		expect(energyBar.dispose).toBeDefined();
	});

	it('should update value to 3', function () {
		energyBar.store(3);
		expect(energyBar.updatedValue).toBe(3);
	});
});