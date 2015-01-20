var BasePlayer = require('../common/base-player');

var Player = function (params) {
  this.id = params.id;
  this.opponentId = params.opponentId;
  this.characterData = params.characterData;
  this.currentAnimation = null;
  this.lastProcessedInput = 0;
  this.location = params.location;
  this.z = params.z || 0;
  this.lives = params.characterData.lives;
  this.damage = params.characterData.damage;
};

Player.prototype = new BasePlayer();

Player.prototype.getID = function() {
  return this.id;
};

Player.prototype.getOpponentId = function() {
  return this.opponentId;
};

Player.prototype.setOpponentId = function(opponentId) {
  this.opponentId = opponentId;
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

Player.prototype.getLives = function () {
  return this.lives;
}

Player.prototype.getDamage = function (action) {
  return this.damage[action];
}

Player.prototype.dealDamage = function (damage) {
  var damageMultiplier = 1;
  if (this.defending) {
    damageMultiplier = 0.2;
  }
  this.lives -= damage * damageMultiplier;
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