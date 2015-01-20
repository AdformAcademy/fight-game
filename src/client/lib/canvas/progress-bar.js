var App = require('../../app');;

var ProgressBar = function (params) {
	this.params = params !== undefined ? params : null;
	this.location = params !== undefined ? params.location : null;
};

ProgressBar.prototype.changeCurrentValue = function (number) {
	this.params.currentValue += number;
};

ProgressBar.prototype.setCurrentValue = function (currentValue) {
	this.params.currentValue = currentValue;
};

ProgressBar.prototype.getCurrentValue = function () {
	return this.params.currentValue;
};

ProgressBar.prototype.setMaxValue = function (maxValue) {
	this.params.maxValue = maxValue;
};

ProgressBar.prototype.getMaxValue = function () {
	return this.params.maxValue;
};

ProgressBar.prototype.getLocation = function () {
	return this.params.location();
};

ProgressBar.prototype.setLocation = function (location) {
	if (typeof location !== 'function') {
		return;
	}
	this.params.location = location;
};

ProgressBar.prototype.getWidth = function () {
	return this.params.width();
};

ProgressBar.prototype.setWidth = function (width) {
	if (typeof width !== 'function') {
		return;
	}
	this.params.width = width;
};

ProgressBar.prototype.getHeight = function () {
	return this.params.height();
};

ProgressBar.prototype.setHeight = function (height) {
	if (typeof height !== 'function') {
		return;
	}
	this.params.height = height;
};

ProgressBar.prototype.getBorder = function () {
	return this.params.border;
};

ProgressBar.prototype.setBorder = function (border) {
	if (typeof border !== 'object') {
		return;
	}
	this.params.border = border;
};

ProgressBar.prototype.getFill = function () {
	return this.params.fill;
};

ProgressBar.prototype.setFill = function (fill) {
	if (typeof fill !== 'object') {
		return;
	}
	this.params.fill = fill;
};

ProgressBar.prototype.drawStatusBarLines = function (canvas, params) {
	var width = params.width();
	var height = params.height();
	canvas.moveTo(50, 0);
	canvas.lineTo(width - 50, 0);
	canvas.arcTo(width, 0, width, 10, params.border.radius);
	canvas.arcTo(width, height, 
		width - 50, height, params.border.radius);
	canvas.lineTo(width - 50, height);
	canvas.arcTo(0, height, 0, 0, params.border.radius);
	canvas.arcTo(0, 0, 50, 0, params.border.radius);
	canvas.lineTo(50, 0);
	canvas.stroke();
};

ProgressBar.prototype.constructSourceLayer = function (canvas, params) {
	canvas.globalAlpha = 0;
	this.drawStatusBarLines(canvas, params);
	canvas.globalAlpha = 1;
	if (params.fill.leftMask === undefined) {
		canvas.fillStyle = params.fill.left;
	} else {
		var pattern = canvas.createPattern(params.fill.leftMask, 'repeat-x');
		canvas.fillStyle = pattern;
	}
	canvas.fill();
};

ProgressBar.prototype.constructDestinationLayer = function (canvas, params) {
	var width = params.width();
	var height = params.height();
	canvas.globalCompositeOperation = 'source-atop';

	if (params.fill.usedMask === undefined) {
		canvas.fillStyle = params.fill.used;
		canvas.globalAlpha = params.fill.usedOpacity;
		canvas.fillRect(0, 0, width * (params.currentValue / params.maxValue), height);
	} else {
		canvas.globalAlpha = params.fill.usedOpacity;
		var pattern = canvas.createPattern(params.fill.usedMask, 'repeat-x');
		canvas.fillStyle = pattern;
		canvas.fillRect(0, 0, width * (params.currentValue / params.maxValue), height);
	}
	canvas.globalAlpha = 1;
};

ProgressBar.prototype.constructBorder = function (canvas, params) {
	canvas.lineWidth = params.border.width;
	canvas.strokeStyle = params.border.color || 'black';
	this.drawStatusBarLines(canvas, params);
};

ProgressBar.prototype.constructImage = function (params) {
	var tempCanvas = document.createElement('canvas');
	var width = params.width();
	var height = params.height();
	tempCanvas.width = width;
	tempCanvas.height = height;
	var canvas = tempCanvas.getContext('2d');

	this.constructSourceLayer(canvas, params);
	this.constructDestinationLayer(canvas, params);

	if (params.border.drawBorder) {
		this.constructBorder(canvas, params);
	}
	
	var image = new Image();
	image.src = tempCanvas.toDataURL();

	return image;
};

ProgressBar.prototype.draw = function () {
	var canvas = App.canvasObj.canvas;
	var location = this.location();
	var image = this.constructImage(this.params);
	canvas.globalAlpha = this.params.fill.globalOpacity;
	canvas.drawImage(image, location.getX(), location.getY());
	canvas.globalAlpha = 1;
};

ProgressBar.prototype.dispose = function () {
};

module.exports = ProgressBar;