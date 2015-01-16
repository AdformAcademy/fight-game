var BasePlayer = function () {
	this.location = null;
	this.z = 0;
	this.speedZ = 0;
	this.jumping = false;
	this.punching = false;
	this.kicking = false;
	this.combo = false;
	this.defending = false;
	this.punched = 0;
};

BasePlayer.prototype.getLocation = function () {
	return this.location;
};

BasePlayer.prototype.setLocation = function (location) {
	this.location = location;
};

BasePlayer.prototype.getZ = function () {
	return this.z;
};

BasePlayer.prototype.setZ = function (z) {
	this.z = z;
};

BasePlayer.prototype.getX = function () {
	return this.location.getX();
};

BasePlayer.prototype.getY = function () {
	return this.location.getY();
};

BasePlayer.prototype.setX = function (x) {
	this.location.setX(x);
};

BasePlayer.prototype.setY = function (y) {
	this.location.setY(y);
};

BasePlayer.prototype.getSpeedZ = function () {
	return this.speedZ;
};

BasePlayer.prototype.setSpeedZ = function (speedZ) {
	this.speedZ = speedZ;
};

BasePlayer.prototype.setJumping = function (jumping) {
	this.jumping = jumping;
};

BasePlayer.prototype.isJumping = function () {
	return this.jumping == true;
};

BasePlayer.prototype.setPunching = function (punching) {
	this.punching = punching;
};

BasePlayer.prototype.isPunching = function () {
	return this.punching == true;
};

BasePlayer.prototype.setKicking = function (kicking) {
	this.kick = kicking;
};

BasePlayer.prototype.isKicking = function() {
	return this.kick == true;
};

BasePlayer.prototype.setUsingCombo = function (combo) {
	this.combo = combo;
};

BasePlayer.prototype.usingCombo = function () {
	return this.combo == true;
};

BasePlayer.prototype.setDefending = function (defending) {
	this.defending = defending;
};

BasePlayer.prototype.isDefending = function () {
	return this.defending == true;
};

BasePlayer.prototype.setPunched = function (punched) {
	this.punched = punched;
};

BasePlayer.prototype.isPunched = function () {
	return this.punched;
};

BasePlayer.prototype.isStanding = function () {
	return !this.isJumping() && !this.isPunching()
	 && !this.isDefending() && !this.isKicking() && !this.usingCombo();
};

BasePlayer.prototype.isJumpingAndPunching = function() {
	return this.isJumping() && this.isPunching();
};

module.exports = BasePlayer;