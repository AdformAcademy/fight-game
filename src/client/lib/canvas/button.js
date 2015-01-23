var App;
var Utilities;
var EventCollection;

function Button(params) {
	App = require('../../app');
	Utilities = require('./utilities');
	EventCollection = require('../event-collection');

	if (!params.useSpriteSheet) {
		this.src = params.image;
		this.image = new Image();
		this.image.src = this.src;
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

Button.prototype.useSpriteSheet = function(useSpriteSheet) {
	this.useSpriteSheet = useSpriteSheet;
};

Button.prototype.usingSpriteSheet = function() {
	return this.useSpriteSheet;
};

Button.prototype.drawButton = function() {
	if (this.visible) {
		var loc = typeof this.location === 'function' ? this.location() : this.location;
		if (this.useSpriteSheet) {
			this.spriteSheet.draw(loc.getX(), loc.getY());
		} else {
			App.canvasObj.canvas.drawImage(this.activeImage, 
				loc.getX(), loc.getY());
		}
	}
};

Button.prototype.pointIntersects = function(location) {
	var loc = typeof this.location === 'function' ? this.location() : this.location;
	if (this.visible) {
		var canvasLocation = Utilities.toCanvasLocation(location);
		var xIntersects = canvasLocation.getX() >= loc.getX() && 
		canvasLocation.getX() <= loc.getX() + this.activeImage.width;
		var yIntersects = canvasLocation.getY() >= loc.getY() &&
		canvasLocation.getY() <= loc.getY() + this.activeImage.height;
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