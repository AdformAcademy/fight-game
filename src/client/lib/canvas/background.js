var Point;
var App;

function Background(image) {
	Point = require('./point');
	App = require('../../app');

	this.src = image;
	this.image = new Image();
	this.image.src = this.src;

	this.location = new Point((screen.width - 1366)/2, (screen.height - 768)/2);
	this.isVisible = true;
	this.width = function () {
		return 1366;
	};
	this.height = function () {
		return 768;
	};
};

Background.prototype.image = function() {
	return this.image;
};

Background.prototype.visible = function() {
	return this.visible;
};

Background.prototype.location = function() {
	return this.location;
};

Background.prototype.draw = function() {
	if (this.visible) {
		App.canvasObj.canvas.drawImage(this.image, 
			this.location.x, this.location.y, this.width(), this.height());
	}
};

module.exports = Background;