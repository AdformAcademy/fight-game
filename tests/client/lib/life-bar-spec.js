'use strict';

var LifeBar = require('../../../src/client/lib/canvas/life-bar.js');
var ProgressBar = require('../../../src/client/lib/canvas/progress-bar.js');
var Point = require('../../../src/common/point.js');

describe('LifeBar', function () {

	var body = $(document.body),
		container,
		canvas,
		paramsMock,
		healthVeryHighMask,
		healthHighMask,
		healthNormalMask,
		healthLowMask,
		healthVeryLowMask,
		leftMaskImage,
		lifeBar;

	beforeEach(function() {
		container = $('<div id="container"></div>');
		body.append(container);
		canvas = $('<canvas id="window" width="900" height="550"></canvas>');
		container.append(canvas);
		point = new Point(0, 0);

		healthVeryHighMask = new Image();
		healthVeryHighMask.src = './img/health/very-high.png';
		healthHighMask = new Image();
		healthHighMask.src = './img/health/high.png';
		healthNormalMask = new Image();
		healthNormalMask.src = './img/health/normal.png';
		healthLowMask = new Image();
		healthLowMask.src = './img/health/low.png';
		healthVeryLowMask = new Image();
		healthVeryLowMask.src = './img/health/very-low.png';
		leftMaskImage = new Image();
		leftMaskImage.src = './img/health/used.png';

		paramsMock = {
			location: point,
			width: 900,
			height: 550,
			currentValue: 50,
			updatedValue: 40,
			maxValue: 90,
			fill: {
				left: '#B5B5B5',
				leftMask: leftMaskImageMock,
				used: '#39BD1E',
				usedMask: healthVeryHighMaskMock,
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

    it('should update usedMask value to healthNormalMask', function () {
        lifeBar.updateMask();
        expect(lifeBar.paramsMock.fill.usedMask).toBe(healthNormalMask);
    });

    it('should update to', function () {
        lifeBar.animateChange();
        expect(lifeBar.paramsMock.currentValue).toBe(40);
    });

});
