var BasePlayer = require('../common/base-player');

var Player = function (params) {
  this.id = params.id;
  this.opponentId = params.opponentId;
  this.characterData = params.characterData;
  this.currentAnimation = null;
  this.lastProcessedInput = 0;
  this.location = params.location;
  this.z = params.z || 0;
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

Player.prototype.toPacket = function() {
  return {
    x: this.location.getX(),
    y: this.location.getY(),
    z: this.z,
    currentAnimation: this.currentAnimation
  };
};

module.exports = Player;