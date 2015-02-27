var BasePlayer = function () {
	this.location = null;
	this.z = 0;
	this.speedZ = 0;
	this.movementSpeed = 1.0;
	this.jumping = false;
	this.punching = false;
	this.kicking = false;
	this.hiting = false;
	this.combo = false;
	this.defending = false;
	this.moving = false;
	this.punched = 0;
	this.won = false;
	this.lost = false;
	this.fatality = false;
};

BasePlayer.prototype.Victory = function(status) {
	this.won = status;
};

BasePlayer.prototype.isVictor = function() {
	return this.won == true;
};

BasePlayer.prototype.Defeat = function(status) {
	this.lost = status;
};

BasePlayer.prototype.isDefeated = function() {
	return this.lost == true;
};

BasePlayer.prototype.Fatality = function(status) {
	this.fatality = status;
};

BasePlayer.prototype.isFatality = function() {
	return this.fatality == true;
};

BasePlayer.prototype.getZ = function () {
	return this.z;
};

BasePlayer.prototype.setZ = function (z) {
	this.z = z;
};

BasePlayer.prototype.getX = function () {
	return this.location
};

BasePlayer.prototype.setX = function (x) {
	this.location = x;
};

BasePlayer.prototype.getMovementSpeed = function () {
	return this.movementSpeed;
};

BasePlayer.prototype.setMovementSpeed = function (movementSpeed) {
	this.movementSpeed = movementSpeed;
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

BasePlayer.prototype.setHiting = function (hiting) {
	this.hit = hiting;
};

BasePlayer.prototype.isHiting = function() {
	return this.hit == true;
};

BasePlayer.prototype.setDefending = function (defending) {
	this.defending = defending;
};

BasePlayer.prototype.isDefending = function () {
	return this.defending == true;
};

BasePlayer.prototype.setMoving = function (moving) {
	this.moving = moving;
};

BasePlayer.prototype.isMoving = function () {
	return this.moving == true;
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