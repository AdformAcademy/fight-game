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

	it('should be defined \'text\'', function() {
		expect(textMock).toBeDefined();
	});

	it('should be defined \'size\'', function() {
		expect(sizeMock).toBeDefined();
	});

	it('should be defined \'location\'', function() {
		expect(text.location).toBeDefined();
	});

	it('should be difined \'font type\'', function() {
		expect(text.fontType).toBeDefined();
	});

	it('should be difined \'color\'', function() {
		expect(text.color).toBeDefined();
	});

	it('should be difined \'is visable\'', function() {
		expect(text.isVisible()).toBeDefined();
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

	it('should get default is visable', function() {
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