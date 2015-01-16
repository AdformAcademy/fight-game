var App = require('../../app');
var Point = require('./point');

var Utilities = {};

Utilities.centerX = function(objectWidth) {
	var halfWidth = objectWidth / 2;
	var middle = App.canvasObj.getWidth() / 2 - halfWidth;
	return middle;
};

Utilities.toCanvasLocation = function(location) {
	var x = location.getX();
	var y = location.getY();
	x -= App.canvasObj.getOffsetLeft();
	y -= App.canvasObj.getOffsetTop();
	return new Point(x, y);
};

module.exports = Utilities;