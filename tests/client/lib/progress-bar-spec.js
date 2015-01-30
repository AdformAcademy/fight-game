'use strict';

var ProgressBar = require('../../../src/client/lib/canvas/progress-bar.js');

describe('ProgressBar', function () {
	var body = $(document.body),
	paramsMock,
	location,
	current,
	maxValue,
	width,
	height,
	border,
	fill;

	paramsMock = {
		location: function () {
			return {
				getX: function () {
					return 0;
				},
				getY: function () {
					return 0;
				}
			};
		},
		width: function () {
			return 100;
		},
		height: function () {
			return 100;
		},
	};

	var progressBar;

	beforeEach(function() {
		progressBar = new ProgressBar(paramsMock);
	});

	it ('should get default \'current\' value', function() {
		expect(progressBar.getCurrentValue()).toBe(undefined);
	});

	it ('should get default \'max\' value', function() {
		expect(progressBar.getMaxValue()).toBe(undefined);
	});

	it ('should get default \'location\' value', function() {
		expect(progressBar.getLocation().getX()).toBe(0);
		expect(progressBar.getLocation().getY()).toBe(0);
	});

	it ('should get default \'width\' value', function() {
		expect(progressBar.getWidth()).toBe(100);
	});

	it ('should get default \'height\' value', function() {
		expect(progressBar.getHeight()).toBe(100);
	});
	
	it ('should get default \'border\' value', function() {
		expect(progressBar.getBorder()).toBe(undefined);
	});

	it ('should get default \'fill\' value', function() {
		expect(progressBar.getFill()).toBe(undefined);
	});

	
    it ('should set current value to current', function() {
        progressBar.setCurrentValue(100);
        expect(progressBar.getCurrentValue()).toBe(100);
    });

    it ('should set max value to maxValue', function() {
        progressBar.setMaxValue(200);
        expect(progressBar.getMaxValue()).toBe(200);
    });

    it ('should set location to location', function() {
    	var mockLocation = {
    		getX: function () {
    			return 50;
    		},
    		getY: function () {
    			return 50;
    		}
    	};
        progressBar.setLocation(function () {
        	return mockLocation;
        });
        expect(progressBar.getLocation()).toBe(mockLocation);
    });

    it ('should set width to width', function() {
        progressBar.setWidth(function () {
        	return 50;
        });
        expect(progressBar.getWidth()).toBe(50);
    });

    it ('should set height to height', function() {
        progressBar.setHeight(function () {
        	return 50;
        });
        expect(progressBar.getHeight()).toBe(50);
    });

    it ('should set border to border', function() {
        progressBar.setBorder(border);
        expect(progressBar.getBorder()).toBe(border);
    });

    it ('should set fill to fill', function() {
        progressBar.setFill(fill);
        expect(progressBar.getFill()).toBe(fill);
    });

});