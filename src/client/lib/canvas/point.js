function Point(x, y) {
	this.x = x;
	this.y = y;
};

Point.prototype.x = function() {
	return this.x;
};

Point.prototype.y = function() {
	return this.y;
};

Point.prototype.toString = function() {
	return 'Point {x=' + this.x + ', y=' + this.y + '}';
};

module.exports = Point;