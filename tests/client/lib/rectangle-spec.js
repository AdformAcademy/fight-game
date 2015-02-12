'use strict';

var Rectangle = require('../../../src/client/lib/canvas/rectangle.js');

describe('Rectangle', function () {

	var rectangle;

	beforeEach(function() {
		rectangle = new Rectangle(0, 0, 3000, 1000);
	});

	it('should define left property', function () {
		expect(rectangle.left).toBeDefined();
	});

	it('should define top property', function () {
		expect(rectangle.top).toBeDefined();
	});

	it('should define width property', function () {
		expect(rectangle.width).toBeDefined();
	});

	it('should define height property', function () {
		expect(rectangle.height).toBeDefined();
	});

	it('should define right property', function () {
		expect(rectangle.right).toBeDefined();
	});

	it('should define bottom property', function () {
		expect(rectangle.bottom).toBeDefined();
	});

	it('should define set method', function () {
		expect(rectangle.set).toBeDefined();
	});

	it('should define within method', function () {
		expect(rectangle.within).toBeDefined();
	});

	it('should define overlaps method', function () {
		expect(rectangle.overlaps).toBeDefined();
	});

	it('should get default left property value', function () {
		expect(rectangle.left).toBe(0);
	});

	it('should get default top property value', function () {
		expect(rectangle.top).toBe(0);
	});

	it('should get default width property value', function () {
		expect(rectangle.width).toBe(3000);
	});

	it('should get default height property value', function () {
		expect(rectangle.height).toBe(1000);
	});

	it('should get default right property value', function () {
		expect(rectangle.right).toBe(3000);
	});

	it('should get default bottom property value', function () {
		expect(rectangle.bottom).toBe(1000);
	});

	it('should set custom values', function () {
		rectangle.set(500, 300, 2000, 5000);
		expect(rectangle.left).toBe(500);
		expect(rectangle.top).toBe(300);
		expect(rectangle.width).toBe(2000);
		expect(rectangle.height).toBe(5000);
		expect(rectangle.right).toBe(2500);
		expect(rectangle.bottom).toBe(5300);
	});


	it('should test if rectangle is within other rectangle', function () {
		var otherRectangle = new Rectangle(0, 0, 5000, 5000);
		expect(rectangle.within(otherRectangle)).toBe(true);
	});

	it('should test if rectangle is not within other rectangle', function () {
		var otherRectangle = new Rectangle(0, 0, 2000, 4000);
		expect(rectangle.within(otherRectangle)).toBe(false);
	});

	it('should test if rectangle overlaps other bigger rectangle', function () {
		var otherRectangle = new Rectangle(0, 0, 5000, 5000);
		expect(rectangle.overlaps(otherRectangle)).toBe(true);
	});

	it('should test if rectangle overlaps other smaller rectangle', function () {
		var otherRectangle = new Rectangle(0, 0, 500, 4000);
		expect(rectangle.overlaps(otherRectangle)).toBe(true);
	});

	it('should not overlap other rectangle', function () {
		var otherRectangle = new Rectangle(-5000, -1000, 500, 500);
		expect(rectangle.overlaps(otherRectangle)).toBe(false);
	});
});