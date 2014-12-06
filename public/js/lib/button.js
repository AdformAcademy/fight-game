var EventCollection = require('./eventCollection.js');

function Button(image, canvasObj) {
	this.src = image;
	this.image = new Image();
	this.image.src = this.src;
	this.width = this.image.width;
	this.height = this.image.height;
	this.canvasObj = canvasObj;
	this.location = null;
	this.onClickEvent = null;
	this.isVisible = true;
	EventCollection.addOnClickObject(this);
}

Button.prototype.visible = function() {
	return this.visible;
}

Button.prototype.location = function() {
	return this.location;
}

Button.prototype.drawButton = function() {
	if (this.visible) {
		this.canvasObj.canvas.drawImage(this.image, this.location.x, this.location.y);
	}
}

Button.prototype.locationIntersects = function(location) {
	if (this.visible) {
		var canvasLocation = this.canvasObj.toCanvasLocation(location);
		var xIntersects = canvasLocation.x >= this.location.x && 
		canvasLocation.x <= this.location.x + this.image.width;
		var yIntersects = canvasLocation.y >= this.location.y &&
		canvasLocation.y <= this.location.y + this.image.height;
		return xIntersects && yIntersects;
	}
	return false;
}

Button.prototype.executeClick = function() {
	this.onClickEvent();
}

Button.prototype.onClick = function(event) {
	this.onClickEvent = event;
}

module.exports = Button;