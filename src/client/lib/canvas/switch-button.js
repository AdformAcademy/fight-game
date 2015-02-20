var App;
var Utilities;
var EventCollection;

function SwitchButton(params) {
	App = require('../../app');
	Utilities = require('./utilities');
	EventCollection = require('../event-collection');

	this.states = [];

	for (var key in params.images) {
		var image = new Image();
		var imageHover = new Image();
		image.src = params.images[key].normal;
		imageHover.src = params.images[key].hover;
		this.states.push({
			normalImage: image,
			hoverImage: imageHover
		});
	}

	this.activeState = params.activeState;
	this.activeImage = this.states[this.activeState].normalImage;

	this.location = params.location || null;
	this.onClickEvent = null;
	this.mouseOverEvent = null;
	this.mouseLeaveEvent = null;
	this.mouseEventAdded = false;
	this.mouseEntered = false;
	this.visible = true;
	this.drawBorder = params.drawBorder || null;
	this.borderWidth = params.borderWidth || null;
	this.borderColor = params.borderColor || 'black';
	this.width = params.width || null;
	this.height = params.height || null;
};

SwitchButton.prototype.getImage = function(state) {
	return this.states[state].normalImage;
};

SwitchButton.prototype.setImage = function(state, image) {
	this.states[state].normalImage = image;
};

SwitchButton.prototype.getHoverImage = function(state) {
	return this.states[state].hoverImage;
};

SwitchButton.prototype.getActiveImage = function() {
	return this.activeImage;
};

SwitchButton.prototype.setActiveImage = function(activeImage) {
	this.activeImage = activeImage;
};

SwitchButton.prototype.buttonWidth = function() {
	return this.activeImage.width;
};

SwitchButton.prototype.buttonHeight = function() {
	return this.activeImage.height;
};

SwitchButton.prototype.setHoverImage = function(state, image) {
	this.states[state].hoverImage = new Image();
	this.states[state].hoverImage.src = image;
};

SwitchButton.prototype.isVisible = function() {
	return this.visible;
};

SwitchButton.prototype.setVisible = function(visible) {
	this.visible = visible;
};

SwitchButton.prototype.getLocation = function() {
	return this.location;
};

SwitchButton.prototype.setLocation = function(location) {
	this.location = location;
};

SwitchButton.prototype.setDrawBorder = function (drawBorder) {
	this.drawBorder = drawBorder;
};

SwitchButton.prototype.borderIsDrawing = function () {
	return this.drawBorder;
};

SwitchButton.prototype.getBorderWidth = function () {
	return this.borderWidth;
};

SwitchButton.prototype.setBorderWidth = function (borderWidth) {
	if (typeof borderWidth === 'number') {
		this.borderWidth = borderWidth;
	}
};

SwitchButton.prototype.getBorderColor = function () {
	return this.borderColor;
};

SwitchButton.prototype.setBorderColor = function (borderColor) {
	this.borderColor = borderColor;
};

SwitchButton.prototype.drawButton = function() {
	var canvas = App.canvasObj.canvas;
	if (this.visible) {
		var loc = typeof this.location === 'function' ? this.location() : this.location;
		if (this.useSpriteSheet) {
			this.spriteSheet.draw(loc.getX(), loc.getY());
		} else {
			canvas.drawImage(this.activeImage, 
				loc.getX(), loc.getY());
		}
		if (this.drawBorder) {
			canvas.strokeStyle = this.borderColor;
			canvas.lineWidth = this.borderWidth;
			canvas.strokeRect(loc.getX(), loc.getY(), this.width, this.height);
		}
	}
};

SwitchButton.prototype.pointIntersects = function(location) {
	var loc = typeof this.location === 'function' ? this.location() : this.location;
	if (this.visible) {
		var buttonWidth, buttonHeight;
		if(this.useSpriteSheet) {
			buttonWidth = this.width;
			buttonHeight = this.height;
		} else {
			buttonWidth = this.activeImage.width;
			buttonHeight = this.activeImage.height;
		}
		var canvasLocation = Utilities.toCanvasLocation(location);
		var xIntersects = canvasLocation.getX() >= loc.getX() && 
		canvasLocation.getX() <= loc.getX() + buttonWidth;
		var yIntersects = canvasLocation.getY() >= loc.getY() &&
		canvasLocation.getY() <= loc.getY() + buttonHeight;
		return xIntersects && yIntersects;
	}
	return false;
};

SwitchButton.prototype.executeClick = function() {
	this.onClickEvent();
};

SwitchButton.prototype.executeMouseOver = function() {
	if (this.mouseOverEvent !== null && !this.mouseEntered) {
		this.mouseOverEvent();
		this.mouseEntered = true;
	}
};

SwitchButton.prototype.executeMouseLeave = function() {
	if (this.mouseLeaveEvent !== null && this.mouseEntered) {
		this.mouseLeaveEvent();
	}
	this.mouseEntered = false;
};

SwitchButton.prototype.onClick = function(event) {
	this.onClickEvent = event;
	EventCollection.addOnClickObject(this);
};

SwitchButton.prototype.mouseOver = function(event) {
	this.mouseOverEvent = event;
	if (!this.mouseEventAdded) {
		EventCollection.addMouseOverObject(this);
		this.mouseEventAdded = true;
	}
};

SwitchButton.prototype.mouseLeave = function(event) {
	this.mouseLeaveEvent = event;
	if (!this.mouseEventAdded) {
		EventCollection.addMouseOverObject(this);
		this.mouseEventAdded = true;
	}
};

SwitchButton.prototype.hover = function() {
	$('body').css('cursor', 'pointer');
}

SwitchButton.prototype.hoverLeave = function() {
	$('body').css('cursor', 'default');
}

SwitchButton.prototype.dispose = function() {
	EventCollection.removeOnClickObject(this);
	EventCollection.removeMouseOverObject(this);
	this.hoverLeave();
}

module.exports = SwitchButton;