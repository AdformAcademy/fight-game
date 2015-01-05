var App;
var Utilities;
var EventCollection;

function Button(image) {
	App = require('../../app');
	Utilities = require('./utilities');
	EventCollection = require('../event-collection');

	this.src = image;
	this.image = new Image();
	this.image.src = this.src;
	this.hoverImage = null;
	this.activeImage = this.image;

	this.location = null;
	this.onClickEvent = null;
	this.mouseOverEvent = null;
	this.mouseLeaveEvent = null;
	this.mouseEventAdded = false;
	this.mouseEntered = false;
	this.visible = true;
};

Button.prototype.getImage = function() {
	return this.image;
};

Button.prototype.setImage = function(image) {
	this.image = image;
};

Button.prototype.getHoverImage = function() {
	return this.hoverImage;
};

Button.prototype.setHoverImage = function(hoverImage) {
	this.hoverImage = hoverImage;
};

Button.prototype.getActiveImage = function() {
	return this.activeImage;
};

Button.prototype.setActiveImage = function(activeImage) {
	this.activeImage = activeImage;
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

Button.prototype.isVisible = function() {
	return this.visible;
};

Button.prototype.setVisible = function(visible) {
	this.visible = visible;
};

Button.prototype.getLocation = function() {
	return this.location;
};

Button.prototype.setLocation = function(location) {
	this.location = location;
};

Button.prototype.drawButton = function() {
	if (this.visible) {
		App.canvasObj.canvas.drawImage(this.activeImage, this.location().getX(), this.location().getY());
	}
};

Button.prototype.pointIntersects = function(location) {
	if (this.visible) {
		var canvasLocation = Utilities.toCanvasLocation(location);
		var xIntersects = canvasLocation.getX() >= this.location().getX() && 
		canvasLocation.getX() <= this.location().getX() + this.activeImage.width;
		var yIntersects = canvasLocation.getY() >= this.location().getY() &&
		canvasLocation.getY() <= this.location().getY() + this.activeImage.height;
		return xIntersects && yIntersects;
	}
	return false;
};

Button.prototype.executeClick = function() {
	this.onClickEvent();
};

Button.prototype.executeMouseOver = function() {
	if (this.mouseOverEvent !== null && !this.mouseEntered) {
		this.mouseOverEvent();
		this.mouseEntered = true;
	}
};

Button.prototype.executeMouseLeave = function() {
	if (this.mouseLeaveEvent !== null && this.mouseEntered) {
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