var App;

var ProgressBar = function (params) {
	App = require('../../app');
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

ProgressBar.prototype.drawSourceLayer = function (canvas, params) {
	var location = this.location();
	var width = params.width();
	var height = params.height();
	canvas.save();
	canvas.globalAlpha = params.fill.leftOpacity;
	if (params.fill.leftMask === undefined) {
		canvas.fillStyle = params.fill.left;
	} else {
		var pattern = canvas.createPattern(params.fill.leftMask, 'repeat');
		canvas.fillStyle = pattern;
	}
	canvas.translate(location.getX(), location.getY());
	canvas.fillRect(0, 0, width, height);
	canvas.globalAlpha = params.fill.globalOpacity;
	canvas.restore();
};

ProgressBar.prototype.drawDestinationLayer = function (canvas, params) {
	var location = this.location();
	var width = params.width();
	var height = params.height();

	canvas.save();
	canvas.globalAlpha = params.fill.usedOpacity;
	if (params.fill.usedMask === undefined) {
		canvas.fillStyle = params.fill.used;
	} else {
		var pattern = canvas.createPattern(params.fill.usedMask, 'repeat');
		canvas.fillStyle = pattern;
	}
	canvas.translate(location.getX(), location.getY());
	canvas.fillRect(0, 0, 
			width * (params.currentValue / params.maxValue), height);
	canvas.globalAlpha = params.fill.globalOpacity;
	canvas.restore();
};

ProgressBar.prototype.constructBorder = function (params) {
	var location = this.location();
	var x = location.getX();
	var y = location.getY();
	var width = params.width();
	var height = params.height();
	var radius = params.border.radius;
	var canvas = App.canvasObj.canvas;

    canvas.beginPath();
    canvas.moveTo(x + radius, y);
    canvas.lineTo(x + width - radius, y);
    canvas.quadraticCurveTo(x + width, y, x + width, y + radius);
    canvas.lineTo(x + width, y + height - radius);
    canvas.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    canvas.lineTo(x + radius, y + height);
    canvas.quadraticCurveTo(x, y + height, x, y + height - radius);
    canvas.lineTo(x, y + radius);
    canvas.quadraticCurveTo(x, y, x + radius, y);
    canvas.closePath();
}

ProgressBar.prototype.draw = function () {
	var canvas = App.canvasObj.canvas;
	var params = this.params;
	canvas.save();
	canvas.globalAlpha = this.params.fill.globalOpacity;
	this.constructBorder(params);
	canvas.clip();
	this.drawSourceLayer(canvas, params);
	this.drawDestinationLayer(canvas, params);
	canvas.restore();
	canvas.globalAlpha = 1;
};

ProgressBar.prototype.dispose = function () {
};

module.exports = ProgressBar;