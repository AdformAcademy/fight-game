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
		paramsMock;
		
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
			maxValue: 10
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

	it('should update value to 8', function () {
		energyBar.store(8);
		jasmine.clock().install();
		energyBar.animateChange();
		expect(energyBar.params.currentValue).toBe(2);
		jasmine.clock().tick(1000);
		expect(energyBar.params.currentValue).toBe(8);
		jasmine.clock().uninstall();
	});
});