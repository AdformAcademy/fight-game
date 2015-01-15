'use strict';

var Text require('../../../src/client/lib/canvas/text.js');

describe('Text', function () {

	var body = $(document.body),
		textMock, 
		sizeMock,
		location,
		fontType,
		color,
		isVisable;

	sizeMock = {};
	textMock = {};

	var text = Text(sizeMock, textMock);

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
		expect(location).toBeDefined();
	});

	it('should be difined \'font type\'', function()) {
		expect(fontType).toBeDefined();
	};

	it('should be difined \'color\'', function()) {
		expect(color).toBeDefined();
	};

	it('should be difined \'is visable\'', function()) {
		expect(isVisable).toBeDefined();
	};

	it('should get default location', function() {
		expect(text.getLocation()).toBe(0);
	});

	it('should get default font type', function() {
		expect(text.getLocation()).toBe('Arial');
	});

	it('should get default color', function() {
		expect(text.getLocation()).toBe('#000000');
	});

	it('should get default size', function() {
		expect(text.getLocation()).toBe(sizeMock);
	});

	it('should get default text', function() {
		expect(text.getLocation()).toBe(textMock);
	});

	it('should get default text width', function() {
		expect(text.getLocation()).toBe(textMock.width);
	});

	it('should get default is visable', function() {
		expect(text.isVisable).toBe(true);
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