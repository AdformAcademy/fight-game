var Point = require('./point.js');

function Background(image, canvasObj) {
	this.src = image;
	this.image = new Image();
	this.image.src = this.src;
	this.canvasObj = canvasObj;

	this.location = new Point(0, 0);
	this.isVisible = true;
	this.width = function () {
		return screen.width;
	};
	this.height = function () {
		return screen.height;
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
		this.canvasObj.canvas.drawImage(this.image, 
			this.location.x, this.location.y, this.width(), this.height());
	}
};

module.exports = Background;