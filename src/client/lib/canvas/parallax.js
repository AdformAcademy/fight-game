var Parallax = function (pattern, camera) {

	this.patterns = [];

	this.camera = camera;
};

Parallax.prototype.addPattern = function (pattern) {
	this.patterns.push(pattern);
};

Parallax.prototype.moveLeft = function () {
	for (var pattern in this.patterns) {
		pattern.moveLeft();
	}
};

Parallax.prototype.moveRight = function () {
	for (var pattern in this.patterns) {
		pattern.moveRight();
	}
};

Parallax.prototype.draw = function () {
	for (var pattern in this.patterns) {
		pattern.draw(this.camera.xView, this.camera.yView);
	}
};

module.exports = Parallax;