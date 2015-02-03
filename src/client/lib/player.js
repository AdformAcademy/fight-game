var App;
var BasePlayer = require('../../common/base-player');
var Config = require('./config');

function Player(params) {
	App = require('../app');
	this.location = params.location;
	this.z = params.z;
	this.spritesheet = params.spriteSheet;
	this.lifeBar = params.lifeBar;
	this.energyBar = params.energyBar;
	this.energyCosts = params.energyCosts;
	this.groundHeight = params.groundHeight;
	this.depth = 0;
};

Player.prototype = new BasePlayer();

Player.prototype.getSpriteSheet = function() {
	return this.spritesheet;
};

Player.prototype.setSpriteSheet = function(spritesheet) {
	this.spritesheet = spritesheet;
};

Player.prototype.setDepth = function (depth) {
	if (depth <= 1 && depth >= 0) {
		this.depth = depth;
	}
};

Player.prototype.getDepth = function() {
	return this.depth;
};

Player.prototype.getLifeBar = function() {
	return this.lifeBar;
};

Player.prototype.getEnergyBar = function() {
	return this.energyBar;
};

Player.prototype.hasEnoughEnergy = function(action) {
	return this.energyBar.getCurrentValue() >= this.energyCosts[action];
}

Player.prototype.setLifeBar = function(lifeBar) {
	this.lifeBar = lifeBar;
};

Player.prototype.setEnergyBar = function(energyBar) {
	this.energyBar = energyBar;
};

Player.prototype.update = function() {
	this.spritesheet.update();
	this.lifeBar.update();
	this.energyBar.update();
};

Player.prototype.draw = function(xView, yView) {
	var playerHeight = this.spritesheet.getSpriteSheetHeight();
	var z = this.groundHeight - playerHeight;
	this.spritesheet.draw(this.getX() - xView, (z + this.getZ()) - yView);
};

module.exports = Player;