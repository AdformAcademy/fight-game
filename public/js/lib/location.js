function Location(x, y) {
	this.x = x;
	this.y = y;
}

Location.prototype.x = function() {
	return this.x;
}

Location.prototype.y = function() {
	return this.y;
}

Location.prototype.toString = function() {
	return 'Location {x=' + this.x + ', y=' + this.y + '}';
}