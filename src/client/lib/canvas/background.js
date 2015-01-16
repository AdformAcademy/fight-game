var Point;
var App;

function Background(image) {
	Point = require('../../../common/point');
	App = require('../../app');

	this.src = image;
	this.image = new Image();
	this.image.src = this.src;

	this.location = new Point(0, 0);
	this.visible = true;

	this.width = function () {
		return App.canvasObj.getWidth();
	};
	this.height = function () {
		return App.canvasObj.getHeight();
	};
};

Background.prototype.getImage = function() {
	return this.image;
};

Background.prototype.setImage = function(image) {
	this.image = image;
};

Background.prototype.isVisible = function() {
	return this.visible;
};

Background.prototype.setVisible = function(visible) {
	this.visible = visible;
};

Background.prototype.getLocation = function() {
	return this.location;
};

Background.prototype.setLocation = function(location) {
	this.location = location;
};

Background.prototype.draw = function() {
	if (this.visible) {
		App.canvasObj.canvas.drawImage(this.image, 
			this.location.getX(), this.location.getY(), this.width(), this.height());
	}
};

module.exports = Background;