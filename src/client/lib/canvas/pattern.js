var App;

var Pattern = function (loader, y, speed, image) {
	var loader = loader;
	var id = loader.append();
	App = require('../../app');
	this.y = y;
	this.x = 0;
	this.speed = speed;
	this.image = new Image();
	this.image.onload = function (id) {
		return function () {
			loader.load(id);
		};
	}(id);
	this.image.src = image;
};

Pattern.prototype.getY = function() {
	return this.y();
};

Pattern.prototype.setY = function(y) {
	if (typeof y !== 'function') {
		return;
	}
	this.y = y;
};

Pattern.prototype.getSpeed = function() {
	return this.speed;
};

Pattern.prototype.setSpeed = function(speed) {
	this.speed = speed;
};

Pattern.prototype.draw = function (xView, yView) {
	var y = this.y();
	var canvas = App.canvasObj.canvas;
	canvas.drawImage(this.image, this.x - xView, y - yView);
};

Pattern.prototype.moveLeft = function () {
	this.x -= this.speed;
};

Pattern.prototype.moveRight = function () {
	this.x += this.speed;
};

module.exports = Pattern;