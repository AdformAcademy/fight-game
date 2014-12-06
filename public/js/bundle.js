(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./eventCollection.js":3}],2:[function(require,module,exports){
var Location = require('./location.js');

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
	return new Location(x, y);
}

module.exports = Canvas;
},{"./location.js":4}],3:[function(require,module,exports){
var Location = require('./location.js');

function EventCollection() {}

EventCollection.clickList = [];

EventCollection.addOnClickObject = function(obj) {
	EventCollection.clickList.push(obj);
}

$(window).click(function (event) {
	var location = new Location(event.pageX, event.pageY);
	for (var key in EventCollection.clickList) {
		if (EventCollection.clickList[key].locationIntersects(location)) {
			EventCollection.clickList[key].executeClick();
		}
	}
});

module.exports = EventCollection;
},{"./location.js":4}],4:[function(require,module,exports){
function Location(x, y) {
	this.x = x;
	this.y = y;
}

Location.prototype.x = function() {
	return this.x;
}

Location.prototype.y = function() {
	return this.y;
}

Location.prototype.toString = function() {
	return 'Location {x=' + this.x + ', y=' + this.y + '}';
}

module.exports = Location;
},{}],5:[function(require,module,exports){
var Canvas = require('./lib/canvas.js');
var Button = require('./lib/button.js');
var Location = require('./lib/location.js');

$(document).ready(function () {
	var canvasObj = new Canvas('#window');
var startButton = new Button('./img/start_button.png', canvasObj);

var middle = canvasObj.width() / 2;

startButton.location = new Location(middle, 200);

startButton.onClick(function() {
	startButton.visible = false;
	//alert('im click event');
});

function graphics() {
	startButton.drawButton();
}

	canvasObj.draw(graphics);
});
},{"./lib/button.js":1,"./lib/canvas.js":2,"./lib/location.js":4}]},{},[5]);
