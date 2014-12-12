var App;

function Player(location) {
	App = require('../app');
	this.location = location;
};

Player.prototype.getLocation = function() {
	return this.location;
};

Player.prototype.setLocation = function(location) {
	this.location = location;
};

Player.prototype.draw = function() {
	App.canvasObj.canvas.fillStyle = '#32FF32';
	App.canvasObj.canvas.fillRect(this.location.getX(), this.location.getY(), 30, 30);
};

module.exports = Player;