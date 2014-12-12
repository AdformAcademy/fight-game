var App;

function Text(text, size) {
	App = require('../../app');

	this.text = text;
	this.size = size;
	this.location = location;
	this.fontType = 'Arial';
	this.color = '#000000';
	this.isVisible = true;
};

Text.prototype.location = function() {
	return this.location;
};

Text.prototype.fontType = function() {
	return this.fontType;
};

Text.prototype.color = function() {
	return this.color;
};

Text.prototype.size = function() {
	return this.size;
};

Text.prototype.text = function() {
	return this.text;
};

Text.prototype.textWidth = function() {
	return App.canvasObj.canvas.measureText(this.text).width;
};

Text.prototype.isVisible = function() {
	return this.isVisible;
};

Text.prototype.draw = function() {
	if (this.isVisible) {
		App.canvasObj.canvas.fillStyle = this.color;
		App.canvasObj.canvas.font =  this.size + 'px ' + this.fontType;
		App.canvasObj.canvas.fillText(this.text, this.location().x, this.location().y);
	}
};

Text.prototype.dispose = function() {
};

module.exports = Text;