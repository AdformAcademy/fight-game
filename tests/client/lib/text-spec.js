'use strict';

var Text = require('../../../src/client/lib/canvas/text.js');

describe('Text', function () {

	var body = $(document.body),
		textMock, 
		sizeMock,
		location,
		fontType,
		color,
		isVisable;

		var text;

	sizeMock = {};
	textMock = {};

	beforeEach(function() {
		text = new Text(textMock, sizeMock);
	});

	it('should define getLocation method', function () {
		expect(text.getLocation).toBeDefined();
	});

	it('should define setLocation method', function () {
		expect(text.setLocation).toBeDefined();
	});

	it('should define getFontType method', function () {
		expect(text.getFontType).toBeDefined();
	});

	it('should define setFontType method', function () {
		expect(text.setFontType).toBeDefined();
	});

	it('should define getColor method', function () {
		expect(text.getColor).toBeDefined();
	});

	it('should define setColor method', function () {
		expect(text.setColor).toBeDefined();
	});

	it('should define getSize method', function () {
		expect(text.getSize).toBeDefined();
	});

	it('should define setSize method', function () {
		expect(text.setSize).toBeDefined();
	});

	it('should define getText method', function () {
		expect(text.getText).toBeDefined();
	});

	it('should define setText method', function () {
		expect(text.setText).toBeDefined();
	});

	it('should define getTextWidth method', function () {
		expect(text.getTextWidth).toBeDefined();
	});

	it('should define isVisible method', function () {
		expect(text.isVisible).toBeDefined();
	});

	it('should define draw method', function () {
		expect(text.draw).toBeDefined();
	});

	it('should get default location', function() {
		expect(text.getLocation().getX()).toBe(0);
		expect(text.getLocation().getY()).toBe(0);
	});

	it('should get default font type', function() {
		expect(text.getFontType()).toBe('Arial');
	});

	it('should get default color', function() {
		expect(text.getColor()).toBe('#000000');
	});

	it('should get default size', function() {
		expect(text.getSize()).toBe(sizeMock);
	});

	it('should get default text', function() {
		expect(text.getText()).toBe(textMock);
	});

	it('should get default is visible', function() {
		expect(text.isVisible()).toBe(true);
	});

    it('should set text to textMock', function() {
        text.setText(textMock);
        expect(text.getText()).toBe(textMock);
    });

    it('should set size to sizeMock', function() {
        text.setSize(sizeMock);
        expect(text.getSize()).toBe(sizeMock);
    });

    it('should set location', function() {
        text.setLocation(location);
        expect(text.getLocation()).toBe(location);
    });

    it('should set font type', function() {
        text.setFontType(fontType);
        expect(text.getFontType()).toBe(fontType);
    });

    it('should set color', function() {
        text.setColor(color);
        expect(text.getColor()).toBe(color);
    });
});