(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
}

Button.prototype.image = function() {
	return this.image;
}

Button.prototype.hoverImage = function() {
	return this.hoverImage;
}

Button.prototype.activeImage = function() {
	return this.activeImage;
}

Button.prototype.buttonWidth = function() {
	return this.activeImage.width;
}

Button.prototype.buttonHeight = function() {
	return this.activeImage.height;
}

Button.prototype.setHoverImage = function(image) {
	this.hoverImage = new Image();
	this.hoverImage.src = image;
}

Button.prototype.visible = function() {
	return this.visible;
}

Button.prototype.location = function() {
	return this.location;
}

Button.prototype.drawButton = function() {
	if (this.visible) {
		this.canvasObj.canvas.drawImage(this.activeImage, this.location().x, this.location().y);
	}
}

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
}

Button.prototype.executeClick = function() {
	this.onClickEvent();
}

Button.prototype.executeMouseOver = function() {
	if (this.mouseOverEvent != null && !this.mouseEntered) {
		this.mouseOverEvent();
		this.mouseEntered = true;
	}
}

Button.prototype.executeMouseLeave = function() {
	if (this.mouseLeaveEvent != null && this.mouseEntered) {
		this.mouseLeaveEvent();
	}
	this.mouseEntered = false;
}

Button.prototype.onClick = function(event) {
	this.onClickEvent = event;
	EventCollection.addOnClickObject(this);
}

Button.prototype.mouseOver = function(event) {
	this.mouseOverEvent = event;
	if (!this.mouseEventAdded) {
		EventCollection.addMouseOverObject(this);
		this.mouseEventAdded = true;
	}
}

Button.prototype.mouseLeave = function(event) {
	this.mouseLeaveEvent = event;
	if (!this.mouseEventAdded) {
		EventCollection.addMouseOverObject(this);
		this.mouseEventAdded = true;
	}
}

module.exports = Button;
},{"../eventCollection.js":6}],2:[function(require,module,exports){
var Point = require('./point.js');

function Canvas(id) {
	this.id = id;
	this.canvasObj = $(this.id)[0];
	this.canvas = this.canvasObj.getContext('2d');
	this.updateInterval = 30;
	this.updateCanvasDimensions();
}

Canvas.prototype.canvas = function() {
	return this.canvas;
}

Canvas.prototype.width = function() {
	return this.canvasObj.width;
}

Canvas.prototype.height = function() {
	return this.canvasObj.height;
}

Canvas.prototype.offsetLeft = function() {
	return this.canvasObj.offsetLeft;
}

Canvas.prototype.offsetTop = function() {
	return this.canvasObj.offsetTop;
}

Canvas.prototype.updateInterval = function() {
	return this.updateInterval;
}

Canvas.prototype.clearCanvas = function() {
	this.canvas.clearRect(0, 0, this.canvasObj.width, this.canvasObj.height);
}

Canvas.prototype.drawGraphics = function(graphics) {
	graphics();
}

Canvas.prototype.drawBackground = function() {
	this.canvas.fillStyle = '#000000';
	this.canvas.fillRect(0, 0, this.canvasObj.width, this.canvasObj.height);
}

Canvas.prototype.updateCanvasDimensions = function() {
	var w = $(window).width();
	var h = $(window).height();
	this.canvasObj.width = w;
	this.canvasObj.height = h;
}

Canvas.prototype.draw = function(graphics) {
	var obj = this;
	this.updateCanvasDimensions();
	this.clearCanvas();
	this.drawBackground();
	this.drawGraphics(graphics);
	setTimeout(function() {
		obj.draw(graphics)
	}, 1000 / this.updateInterval);
}

Canvas.prototype.toCanvasLocation = function(location) {
	var x = location.x;
	var y = location.y;
	x -= this.canvasObj.offsetLeft;
	y -= this.canvasObj.offsetTop;
	return new Point(x, y);
}

module.exports = Canvas;
},{"./point.js":3}],3:[function(require,module,exports){
function Point(x, y) {
	this.x = x;
	this.y = y;
}

Point.prototype.x = function() {
	return this.x;
}

Point.prototype.y = function() {
	return this.y;
}

Point.prototype.toString = function() {
	return 'Point {x=' + this.x + ', y=' + this.y + '}';
}

module.exports = Point;
},{}],4:[function(require,module,exports){
function Text(canvasObj, text, size) {
	this.canvasObj = canvasObj;
	this.text = text;
	this.size = size;
	this.location = location;
	this.fontType = 'Arial';
	this.color = '#000000';
	this.isVisible = true;
}

Text.prototype.location = function() {
	return this.location;
}

Text.prototype.fontType = function() {
	return this.fontType;
}

Text.prototype.color = function() {
	return this.color;
}

Text.prototype.size = function() {
	return this.size;
}

Text.prototype.text = function() {
	return this.text;
}

Text.prototype.textWidth = function() {
	return this.canvasObj.canvas.measureText(this.text).width;
}

Text.prototype.isVisible = function() {
	return this.isVisible;
}

Text.prototype.draw = function() {
	if (this.isVisible) {
		this.canvasObj.canvas.fillStyle = this.color;
		this.canvasObj.canvas.font =  this.size + 'px ' + this.fontType;
		this.canvasObj.canvas.fillText(this.text, this.location().x, this.location().y);
	}
}

module.exports = Text;
},{}],5:[function(require,module,exports){
function Utilities() {}

Utilities.centerX = function(canvasObj, objectWidth) {
	var halfWidth = objectWidth / 2;
	var middle = canvasObj.width() / 2 - halfWidth;
	return middle;
}

module.exports = Utilities;
},{}],6:[function(require,module,exports){
var Point = require('./canvas/point.js');

function EventCollection() {}

EventCollection.clickList = [];
EventCollection.mouseOverList = [];

EventCollection.addOnClickObject = function(obj) {
	EventCollection.clickList.push(obj);
}

EventCollection.addMouseOverObject = function(obj) {
	EventCollection.mouseOverList.push(obj);
}

$(window).click(function(event) {
	var location = new Point(event.pageX, event.pageY);
	for (var key in EventCollection.clickList) {
		if (EventCollection.clickList[key].pointIntersects(location)) {
			EventCollection.clickList[key].executeClick();
		}
	}
});

$(window).mousemove(function(event) {
	var location = new Point(event.pageX, event.pageY);
	for (var key in EventCollection.mouseOverList) {
		if (EventCollection.mouseOverList[key].pointIntersects(location)) {
			EventCollection.mouseOverList[key].executeMouseOver();
		} else {
			EventCollection.mouseOverList[key].executeMouseLeave();
		}
	}
});

module.exports = EventCollection;
},{"./canvas/point.js":3}],7:[function(require,module,exports){
var Canvas = require('./lib/canvas/canvas.js');
var Utilities = require('./lib/canvas/utilities.js');

var Button = require('./lib/canvas/button.js');
var Point = require('./lib/canvas/point.js');
var Text = require('./lib/canvas/text.js');

var canvasObj = new Canvas('#window');
var startButton = new Button('./img/start_button.png', canvasObj);
startButton.setHoverImage('./img/start_button_hover.png');
var startText = new Text(canvasObj,
	'Are you ready to begin a fight?',
	30);

startText.color = '#cbcbcb';
startText.fontType = 'Arial';

startButton.location = function() {
	var x = Utilities.centerX(canvasObj, startButton.activeImage.width);
	var y = canvasObj.height() * 0.4;
	return new Point(x, y);
}

startText.location = function() {
	var x = Utilities.centerX(canvasObj, startText.textWidth());
	var y = canvasObj.height() * 0.2;
	return new Point(x, y);
}

startButton.onClick(function() {
	//TODO add waiting other player event
});

startButton.mouseOver(function() {
	startButton.activeImage = startButton.hoverImage;
	$('body').css('cursor', 'pointer');
	console.log('mouse over');
});

startButton.mouseLeave(function() {
	startButton.activeImage = startButton.image;
	$('body').css('cursor', 'default');
	console.log('mouse leave');
});

function graphics() {
	startButton.drawButton();
	startText.draw();
}

//load this chunk of code when all external sources was loaded
$(window).load(function () {
	canvasObj.draw(graphics);
});
},{"./lib/canvas/button.js":1,"./lib/canvas/canvas.js":2,"./lib/canvas/point.js":3,"./lib/canvas/text.js":4,"./lib/canvas/utilities.js":5}]},{},[7]);
