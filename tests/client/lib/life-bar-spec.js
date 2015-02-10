'use strict';

var body = $(document.body);
var canvas = $('<canvas id="window" width="900" height="550"></canvas>');
var container = $('<div id="container"></div>');
body.append(container);
container.append(canvas);

var LifeBar = require('../../../src/client/lib/canvas/life-bar.js');
var ProgressBar = require('../../../src/client/lib/canvas/progress-bar.js');
var Point = require('../../../src/common/point.js');

describe('LifeBar', function () {

	var body = $(document.body),
		container,
		canvas,
		paramsMock,
		lifeBar,
		point;

	beforeEach(function() {
		container = $('<div id="container"></div>');
		body.append(container);
		canvas = $('<canvas id="window" width="900" height="550"></canvas>');
		container.append(canvas);
		point = new Point(0, 0);

		paramsMock = {
			loader: {
				append: function () {},
				load: function () {}
			},
			location: point,
			width: 900,
			height: 550,
			currentValue: 50,
			maxValue: 100,
			fill: {
				left: '#B5B5B5',
				leftMask: {},
				used: '#39BD1E',
				usedMask: {},
				leftOpacity: 1,
				usedOpacity: 1,
				globalOpacity: 1
			}
		};
		lifeBar = new LifeBar(paramsMock);
	});

	afterEach(function() {
		body.empty();
	});

	it('should be defined \'store\'', function () {
        expect(lifeBar.store).toBeDefined();
    });

    it('should be defined \'animateChange\'', function () {
        expect(lifeBar.animateChange).toBeDefined();
    });

    it('should be defined \'update\'', function () {
        expect(lifeBar.update).toBeDefined();
    });

    it('should be defined \'dispose\'', function () {
        expect(lifeBar.dispose).toBeDefined();
    });

    it('should update value to 3', function () {
        lifeBar.store(3);
        expect(lifeBar.updatedValue).toBe(3);
    });

    it('should update to', function () {
    	lifeBar.store(40);
    	jasmine.clock().install();
        lifeBar.animateChange();
        expect(lifeBar.params.currentValue).toBe(50);
        jasmine.clock().tick(1000);
        expect(lifeBar.params.currentValue).toBe(40);
        jasmine.clock().uninstall();
    });
});
