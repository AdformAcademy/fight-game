var App;

function Player(location, spritesheet) {
	App = require('../app');
	this.location = location;
	this.spritesheet = spritesheet;
	this.jump = 0;
	this.punch = 0;
	this.kick = 0;
	this.z = 0;
	this.speedZ = 0;
	this.depth = 0;
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

Player.prototype.setPunchState = function(punchState){
	this.punch = punchState;
};

Player.prototype.isPunching = function(){
	return this.punch === 1;
};

Player.prototype.setKickState = function(kickState) {
	this.kick = kickState;
}

Player.prototype.isKicking = function() {
	return this.kick === 1;
}

Player.prototype.getSpriteSheet = function() {
	return this.spritesheet;
};

Player.prototype.setSpriteSheet = function(spritesheet) {
	this.spritesheet = spritesheet;
};

Player.prototype.setDepth = function(depth) {
	this.depth = depth;
};

Player.prototype.getDepth = function() {
	return this.depth;
};

Player.prototype.update = function() {
	this.spritesheet.update();
};

Player.prototype.draw = function() {
	this.spritesheet.draw(this.location.getX(), this.location.getY() + this.getZ());
};

module.exports = Player;