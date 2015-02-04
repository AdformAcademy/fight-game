var BasePlayer = require('../common/base-player');
var Config = require('./config.js');

var Player = function (params) {
  this.id = params.id;
  this.opponentId = params.opponentId;
  this.characterData = params.characterData;
  this.currentAnimation = null;
  this.lastProcessedInput = 0;
  this.location = params.location;
  this.z = params.z || 0;
  this.maxLives = params.characterData.lives;
  this.lives = params.characterData.lives;
  this.damage = params.characterData.damage;
  this.costs = params.characterData.costs;
  this.maxEnergy = params.characterData.maxEnergy;
  this.energy = params.characterData.maxEnergy / 2;
  this.characterId = params.characterId || 1;
  this.sounds = [];
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
};

Player.prototype.getDamage = function (action) {
  return this.damage[action];
};

Player.prototype.getEnergy = function () {
  return this.energy;
};

Player.prototype.dealDamage = function (damage) {
  var damageMultiplier = 1;
  if (this.defending) {
    damageMultiplier = Config.playerDefenceMultiplier;
  }
  this.lives -= damage * damageMultiplier;
};

Player.prototype.useEnergy = function (action) {
  this.energy -= this.costs[action];
  if (this.energy < 0) {
    this.energy = 0;
  }
};

Player.prototype.addEnergy = function (action) {
  this.energy += this.costs[action];
  if (this.energy > this.maxEnergy) {
    this.energy = this.maxEnergy;
  }
};

Player.prototype.increaseEnergy = function () {
  this.energy += Config.playerEnergyIncrement;
  if(this.energy > this.maxEnergy) {
    this.energy = this.maxEnergy;
  }
};

Player.prototype.setCharacterId = function (id) {
  this.characterId = id;
};

Player.prototype.getCharacterId = function () {
  return this.characterId;
};

Player.prototype.storeSound = function(packet, sound) {
  this.sounds.push({
    packet: packet,
    sound: sound
  });
};

Player.prototype.clearSounds = function() {
  this.sounds = [];
}

Player.prototype.getSounds = function () {
  return this.sounds;
}

Player.prototype.toPacket = function() {
  return {
    x: this.location,
    z: this.z,
    currentAnimation: this.currentAnimation
  };
};

module.exports = Player;