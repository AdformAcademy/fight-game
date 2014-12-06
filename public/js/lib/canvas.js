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