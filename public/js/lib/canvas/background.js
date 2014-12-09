function Background(image, canvasObj) {
	this.src = image;
	this.image = new Image();
	this.image.src = this.src;
	this.canvasObj = canvasObj;

	this.location = null;
	this.isVisible = true;
};

Background.prototype.image = function() {
	return this.image;
}

Background.prototype.visible = function() {
	return this.visible;
};

Background.prototype.location = function() {
	return this.location;
};

Background.prototype.drawBackgroundImage = function() {
	if (this.visible) {
		this.canvasObj.canvas.drawImage(this.image, 
			this.location().x, this.location().y);
	}
};

module.exports = Background;