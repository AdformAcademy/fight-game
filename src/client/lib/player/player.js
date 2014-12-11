var App;
var Point;

function Player(location) {
  App = require('../../app.js');
  Point = require('../canvas/point.js');

	this.location = location;
	obj = this;
};

Player.prototype.draw = function() {
	App.canvasObj.canvas.fillStyle = '#ff0000';
	App.canvasObj.canvas.fillRect(this.location.x,this.location.y,30,30);
};

module.exports = Player;