var App;

function Player(location) {
	App = require('../app');
	this.location = location;
	this.jump = 0;
	this.z = 0;
	this.speedZ = 0;
};

Player.prototype.getLocation = function() {
	return this.location;
};

Player.prototype.setLocation = function(location) {
	this.location = location;
};

Player.prototype.getZ = function() {
	return this.z;
};

Player.prototype.setZ = function(z) {
	this.z = z;
};

Player.prototype.getSpeedZ = function(){
  return this.speedZ;
};

Player.prototype.setSpeedZ = function(speedZ){
  this.speedZ = speedZ;
};

Player.prototype.setJumpState = function(jumpstate){
	this.jump = jumpstate;
};

Player.prototype.isJumping = function(){
	return this.jump === 1;
};

Player.prototype.draw = function() {
	App.canvasObj.canvas.fillStyle = '#32FF32';
	App.canvasObj.canvas.fillRect(this.location.getX(), this.location.getY() + this.getZ(), 30, 30);
};

module.exports = Player;