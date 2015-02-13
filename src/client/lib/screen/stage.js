var App;
var Client;
var obj;
var SoundCollection;

function StageScreen() {
	App = require('../../app');
	Client = require('../client');
	SoundCollection = require('../sound-collection');
	this.player = App.player;
	this.opponent = App.opponent;
	obj = this;
	this.parallax = Client.parallax;
	Client.start();
	SoundCollection.play('common', 'theme');
};

StageScreen.prototype.graphics = function() {
	var player = obj.player;
	var opponent = obj.opponent;
	var playerLifeBar = player.getLifeBar();
	var opponentLifebar = opponent.getLifeBar();
	var playerEnergyBar = player.getEnergyBar();
	var opponentEnergyBar = opponent.getEnergyBar();
	var xView = Client.camera.xView;
	var yView = Client.camera.yView;
	
	obj.parallax.draw();
	if (player.getDepth() > opponent.getDepth()) {
		player.draw(xView, yView);
		opponent.draw(xView, yView);
	} else {
		opponent.draw(xView, yView);
		player.draw(xView, yView);
	}
	playerLifeBar.draw();
	playerEnergyBar.draw();
	opponentLifebar.draw();
	opponentEnergyBar.draw();
};

StageScreen.prototype.dispose = function() {
	obj.player.getLifeBar().dispose();
	obj.opponent.getLifeBar().dispose();
};

module.exports = StageScreen;