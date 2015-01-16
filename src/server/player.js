var Player = function (params) {
  this.id = params.id;
  this.opponentId = params.opponentId;
  this.location = params.location;
  this.z = params.z || 0;
  this.speedZ = 0;
  this.jumping = false;
  this.punching = false;
  this.punched = 0;
  this.kicking = false;
  this.defending = false;
  this.combo = false;
  this.lastProcessedInput = 0;
  this.currentAnimation = null;
  this.characterData = params.characterData;
};

Player.prototype.getID = function() {
  return this.id;
};

Player.prototype.getOpponentId = function() {
  return this.opponentId;
};

Player.prototype.setOpponentId = function(opponentId) {
  this.opponentId = opponentId;
};

Player.prototype.getLocation = function () {
  return this.location;
};

Player.prototype.setLocation = function (location) {
  this.location = location;
};

Player.prototype.getX = function() {
  return this.location.getX();
};

Player.prototype.getY = function() {
  return this.location.getY();
};

Player.prototype.getZ = function() {
  return this.z;
};

Player.prototype.getSpeedZ = function() {
  return this.speedZ;
};

Player.prototype.isJumping = function() {
  return this.jumping;
};

Player.prototype.isPunching = function() {
  return this.punching;
};

Player.prototype.isPunched = function() {
  return this.punched;
};

Player.prototype.isKicking = function() {
  return this.kicking;
};

Player.prototype.setX = function(x) {
  this.location.setX(x);
};

Player.prototype.setY = function(y) {
  this.location.setY(y);
};

Player.prototype.setZ = function(z) {
  this.z = z;
};

Player.prototype.setSpeedZ = function(speedZ) {
  this.speedZ = speedZ;
};

Player.prototype.setJumping = function(jumping) {
  this.jumping = jumping;
};

Player.prototype.setPunching = function(punching) {
  this.punching = punching;
};

Player.prototype.setPunched = function(punched) {
  this.punched = punched;
};

Player.prototype.setKicking = function (kicking) {
  this.kicking = kicking;
}

Player.prototype.setDefending = function (defending) {
  this.defending = defending;
};

Player.prototype.isDefending = function () {
  return this.defending;
};

Player.prototype.setUsingCombo = function (combo) {
  this.combo = combo;
};

Player.prototype.usingCombo = function () {
  return this.combo;
};

Player.prototype.setLastProcessedInput = function(input) {
  this.lastProcessedInput = input;
};

Player.prototype.getLastProcessedInput = function() {
  return this.lastProcessedInput;
};

Player.prototype.setCurrentAnimation = function (animation) {
  this.currentAnimation = animation;
};

Player.prototype.getCurrentAnimation = function () {
  return this.currentAnimation;
};

Player.prototype.getCharacterData = function () {
  return this.characterData;
};

Player.prototype.toPacket = function() {
  return {
    x: this.location.getX(),
    y: this.location.getY(),
    z: this.z,
    currentAnimation: this.currentAnimation
  };
};

module.exports = Player;