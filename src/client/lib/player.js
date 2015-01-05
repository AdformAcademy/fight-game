var App;

function Player(location, spritesheet) {
	App = require('../app');
	this.location = location;
	this.spritesheet = spritesheet;
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

Player.prototype.getSpriteSheet = function() {
	return this.spritesheet;
};

Player.prototype.setSpriteSheet = function(spritesheet) {
	this.spritesheet = spritesheet;
};

Player.prototype.update = function() {
	this.spritesheet.update();
};

Player.prototype.draw = function() {
	this.spritesheet.draw(this.location.getX(), this.location.getY() + this.getZ());
};

module.exports = Player;