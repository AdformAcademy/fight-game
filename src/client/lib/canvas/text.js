var App;
var Point;

function Text(text, size) {
	App = require('../../app');
	Point = require('../../../common/point');

	this.text = text;
	this.size = size;
	this.location = new Point(0, 0);
	this.fontType = 'Arial';
	this.color = '#000000';
	this.visible = true;
};

Text.prototype.getLocation = function() {
	return this.location;
};

Text.prototype.setLocation = function(location) {
	this.location = location;
};

Text.prototype.getFontType = function() {
	return this.fontType;
};

Text.prototype.setFontType = function(fontType) {
	this.fontType = fontType;
};

Text.prototype.getColor = function() {
	return this.color;
};

Text.prototype.setColor = function(color) {
	this.color = color;
};

Text.prototype.getSize = function() {
	return this.size;
};

Text.prototype.setSize = function(size) {
	this.size = size;
};

Text.prototype.getText = function() {
	return this.text;
};

Text.prototype.setText = function(text) {
	this.text = text;
};

Text.prototype.getTextWidth = function() {
	return App.canvasObj.canvas.measureText(this.text).width;
};

Text.prototype.isVisible = function() {
	return this.visible;
};

Text.prototype.draw = function() {
	if (this.isVisible) {
		App.canvasObj.canvas.fillStyle = this.color;
		App.canvasObj.canvas.font =  this.size + 'px ' + this.fontType;
		App.canvasObj.canvas.fillText(this.text, this.location().getX(), this.location().getY());
	}
};

Text.prototype.dispose = function() {
};

module.exports = Text;