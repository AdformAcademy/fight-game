var App;
var Utilities;
var EventCollection;

function Button(params) {
	App = require('../../app');
	Utilities = require('./utilities');
	EventCollection = require('../event-collection');

	if (!params.useSpriteSheet) {
		this.src = params.image || undefined;
		this.image = new Image();
		this.image.src = this.src || '';
		this.hoverImage = new Image();
		this.hoverImage.src = params.hoverImage || this.image.src;
		this.activeImage = this.image;
	}
	this.id = params.id || null;
	this.location = params.location || null;
	this.onClickEvent = null;
	this.mouseOverEvent = null;
	this.mouseLeaveEvent = null;
	this.mouseEventAdded = false;
	this.mouseEntered = false;
	this.visible = true;
	this.useSpriteSheet = params.useSpriteSheet || false;
	this.spriteSheet = params.spriteSheet || null;
	this.drawBorder = params.drawBorder || null;
	this.borderWidth = params.borderWidth || null;
	this.borderColor = params.borderColor || 'black';
	this.width = params.width || null;
	this.height = params.height || null;

	this.touched = false;
	this.touchStartEvent = params.touchStartEvent;
	this.touchEndEvent = params.touchEndEvent;
	this.touchResetEvent = params.touchResetEvent;
};

Button.prototype.getId = function () {
	return this.id;
};

Button.prototype.setId = function (id) {
	this.id = id;
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

Button.prototype.setSpriteSheet = function(spriteSheet) {
	this.spriteSheet = spriteSheet;
};

Button.prototype.getSpriteSheet = function() {
	return this.spriteSheet;
};

Button.prototype.setUsingSpriteSheet = function(useSpriteSheet) {
	this.useSpriteSheet = useSpriteSheet;
};

Button.prototype.usingSpriteSheet = function() {
	return this.useSpriteSheet;
};

Button.prototype.setDrawBorder = function (drawBorder) {
	this.drawBorder = drawBorder;
};

Button.prototype.borderIsDrawing = function () {
	return this.drawBorder;
};

Button.prototype.getBorderWidth = function () {
	return this.borderWidth;
};

Button.prototype.setBorderWidth = function (borderWidth) {
	if (typeof borderWidth === 'number') {
		this.borderWidth = borderWidth;
	}
};

Button.prototype.getBorderColor = function () {
	return this.borderColor;
};

Button.prototype.setBorderColor = function (borderColor) {
	this.borderColor = borderColor;
};

Button.prototype.drawButton = function() {
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

Button.prototype.pointIntersects = function(location) {
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
};

Button.prototype.hoverLeave = function() {
	$('body').css('cursor', 'default');
};

Button.prototype.resetTouch = function () {
	this.touched = false;
	if (typeof this.touchResetEvent === 'function') {
		this.touchResetEvent();
	}
};

Button.prototype.touchStart = function () {
	this.touched = true;
	if (typeof this.touchStartEvent === 'function') {
		this.touchStartEvent();
	}
};

Button.prototype.touchEnd = function () {
	if (this.touched) {
		this.touched = false;
		if (typeof this.touchEndEvent === 'function') {
			this.touchEndEvent();
		}
	}
};

Button.prototype.dispose = function() {
	EventCollection.removeOnClickObject(this);
	EventCollection.removeMouseOverObject(this);
	this.hoverLeave();
}

module.exports = Button;