var Parallax = function (camera) {
	this.patterns = [];
	this.camera = camera;
};

Parallax.prototype.addPattern = function (pattern) {
	this.patterns.push(pattern);
};

Parallax.prototype.moveLeft = function () {
	if (this.camera.isFollowing()) {
		for (var i = 0; i < this.patterns.length; i++) {
			this.patterns[i].moveLeft();
		}
	}
};

Parallax.prototype.moveRight = function () {
	if (this.camera.isFollowing()) {
		for (var i = 0; i < this.patterns.length; i++) {
			this.patterns[i].moveRight();
		}
	}
};

Parallax.prototype.draw = function () {
	var xView = this.camera.getXView();
	var yView = this.camera.getYView();
	for (var i = 0; i < this.patterns.length; i++) {
		this.patterns[i].draw(xView, yView);
	}
};

module.exports = Parallax;