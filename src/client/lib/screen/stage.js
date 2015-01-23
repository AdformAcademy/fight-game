var App;
var Client;
var Point;
var Background;
var obj;

function StageScreen() {
	App = require('../../app');
	Client = require('../client');
	Point = require('../../../common/point');
	Background = require('../canvas/background');
	this.backgroundImage = new Background('./img/stage_background.png');
	this.player = App.player;
	this.opponent = App.opponent;
	obj = this;
	Client.start();
};

StageScreen.prototype.graphics = function() {
	var player = obj.player;
	var opponent= obj.opponent;
	var playerLifeBar = player.getLifeBar();
	var opponentLifebar = opponent.getLifeBar();
	var playerEnergyBar = player.getEnergyBar();
	var opponentEnergyBar = opponent.getEnergyBar();

	obj.backgroundImage.draw();
	if (player.getDepth() > opponent.getDepth()) {
		player.draw();
		opponent.draw();
	} else {
		opponent.draw();
		player.draw();
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