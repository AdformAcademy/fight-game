var Point;
var App;

var Pattern = function (location, speed, image) {

	App = require('../../app');
	Point = require('../../../common/point');

	this.location = new Point(0, 0);
	this.speed = speed;
	this.image = new Image();
	this.image.src = image;
};

Pattern.prototype.getLocation = function() {
	return this.location;
};

Pattern.prototype.setLocation = function(location) {
	this.location = location;
};

Pattern.prototype.getSpeed = function() {
	return this.speed;
};

Pattern.prototype.setSpeed = function(speed) {
	this.speed = speed;
};

Pattern.prototype.draw = function (xView, yView) {
	var canvas = App.canvasObj.canvas;
	canvas.drawImage(this.image, this.location.getX() - xView, this.location.getY() - yView);
};

Pattern.prototype.moveLeft = function () {
	var x = this.location.getX();
	this.location.setX(x - this.speed);
};

Pattern.prototype.moveRight = function () {
	var x = this.location.getX();
	this.location.setX(x + this.speed);
};

module.exports = Pattern;