var EventCollection = require('../eventCollection.js');

function Button(image, canvasObj) {
	this.src = image;
	this.image = new Image();
	this.image.src = this.src;
	this.hoverImage = null;
	this.activeImage = this.image;

	this.canvasObj = canvasObj;
	this.location = null;
	this.onClickEvent = null;
	this.mouseOverEvent = null;
	this.mouseLeaveEvent = null;
	this.mouseEventAdded = false;
	this.mouseEntered = false;
	this.isVisible = true;
};

Button.prototype.image = function() {
	return this.image;
};

Button.prototype.hoverImage = function() {
	return this.hoverImage;
};

Button.prototype.activeImage = function() {
	return this.activeImage;
};

Button.prototype.buttonWidth = function() {
	return this.activeImage.width;
};

Button.prototype.buttonHeight = function() {
	return this.activeImage.height;
};

Button.prototype.setHoverImage = function(image) {
	this.hoverImage = new Image();
	this.hoverImage.src = image;
};

Button.prototype.visible = function() {
	return this.visible;
};

Button.prototype.location = function() {
	return this.location;
};

Button.prototype.drawButton = function() {
	if (this.visible) {
		this.canvasObj.canvas.drawImage(this.activeImage, this.location().x, this.location().y);
	}
};

Button.prototype.pointIntersects = function(location) {
	if (this.visible) {
		var canvasLocation = this.canvasObj.toCanvasLocation(location);
		var xIntersects = canvasLocation.x >= this.location().x && 
		canvasLocation.x <= this.location().x + this.activeImage.width;
		var yIntersects = canvasLocation.y >= this.location().y &&
		canvasLocation.y <= this.location().y + this.activeImage.height;
		return xIntersects && yIntersects;
	}
	return false;
};

Button.prototype.executeClick = function() {
	this.onClickEvent();
};

Button.prototype.executeMouseOver = function() {
	if (this.mouseOverEvent != null && !this.mouseEntered) {
		this.mouseOverEvent();
		this.mouseEntered = true;
	}
};

Button.prototype.executeMouseLeave = function() {
	if (this.mouseLeaveEvent != null && this.mouseEntered) {
		this.mouseLeaveEvent();
	}
	this.mouseEntered = false;
};

Button.prototype.onClick = function(event) {
	this.onClickEvent = event;
	EventCollection.addOnClickObject(this);
};

Button.prototype.mouseOver = function(event) {
	this.mouseOverEvent = event;
	if (!this.mouseEventAdded) {
		EventCollection.addMouseOverObject(this);
		this.mouseEventAdded = true;
	}
};

Button.prototype.mouseLeave = function(event) {
	this.mouseLeaveEvent = event;
	if (!this.mouseEventAdded) {
		EventCollection.addMouseOverObject(this);
		this.mouseEventAdded = true;
	}
};

Button.prototype.hover = function() {
	$('body').css('cursor', 'pointer');
}

Button.prototype.hoverLeave = function() {
	$('body').css('cursor', 'default');
}

Button.prototype.dispose = function() {
	EventCollection.removeOnClickObject(this);
	EventCollection.removeMouseOverObject(this);
	this.hoverLeave();
}

module.exports = Button;