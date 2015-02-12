'use strict';

var Parallax = require('../../../src/client/lib/canvas/parallax.js');

describe('Parallax', function () {
	var body = $(document.body),
	cameraMock,
	patternMock;

	cameraMock = {};
	patternMock = {};

	var parallax;

	beforeEach(function() {
		parallax = new Parallax(cameraMock);
	});

	it ('should be defined \'camera\'', function() {
		expect(cameraMock).toBeDefined();
	});

	it ('should be defined \'pattern\'', function() {
		expect(patternMock).toBeDefined();
	});

	it ('should add default pattern', function() {
		parallax.addPattern(patternMock);
		expect(parallax.patterns.length).toBe(1);
	});

	it ('should move left', function() {
		for (var i = 0; i < parallax.patterns.length; i++) {
			parallax.patterns[i].moveLeft();
			expect(parallax.patterns[i].getY()).toBe(parallax.patterns[i-1].getY());
		}
	});

	it ('should move right', function() {
		for (var i = 0; i < parallax.patterns.length; i++) {
			parallax.patterns[i].moveRight();
			expect(parallax.patterns[i].getY()).toBe(parallax.patterns[i+1].getY());
		}
	});
});