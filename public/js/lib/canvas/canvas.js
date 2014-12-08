var Point = require('./point.js');

function Canvas(id) {
	this.id = id;
	this.canvasObj = $(this.id)[0];
	this.canvas = this.canvasObj.getContext('2d');
	this.updateInterval = 30;
	this.updateCanvasDimensions();
	this.graphics = null;
};

Canvas.prototype.canvas = function() {
	return this.canvas;
};

Canvas.prototype.width = function() {
	return this.canvasObj.width;
};

Canvas.prototype.height = function() {
	return this.canvasObj.height;
};

Canvas.prototype.offsetLeft = function() {
	return this.canvasObj.offsetLeft;
};

Canvas.prototype.offsetTop = function() {
	return this.canvasObj.offsetTop;
};

Canvas.prototype.updateInterval = function() {
	return this.updateInterval;
};

Canvas.prototype.clearCanvas = function() {
	this.canvas.clearRect(0, 0, this.canvasObj.width, this.canvasObj.height);
};

Canvas.prototype.graphics = function() {
	return this.graphics;
};

Canvas.prototype.drawGraphics = function() {
	if (this.graphics != null) {
		this.graphics();
	}
};

Canvas.prototype.drawBackground = function() {
	this.canvas.fillStyle = '#000000';
	this.canvas.fillRect(0, 0, this.canvasObj.width, this.canvasObj.height);
};

Canvas.prototype.updateCanvasDimensions = function() {
	var w = $(window).width();
	var h = $(window).height();
	this.canvasObj.width = w;
	this.canvasObj.height = h;
};

Canvas.prototype.draw = function() {
	var obj = this;
	this.updateCanvasDimensions();
	this.clearCanvas();
	this.drawBackground();
	this.drawGraphics();
	setTimeout(function() {
		obj.draw()
	}, 1000 / this.updateInterval);
};

Canvas.prototype.toCanvasLocation = function(location) {
	var x = location.x;
	var y = location.y;
	x -= this.canvasObj.offsetLeft;
	y -= this.canvasObj.offsetTop;
	return new Point(x, y);
};

module.exports = Canvas;