var App;
var Utilities;
var Point;
var Text;
var obj;
var Client;
var SoundCollection;

function TrainingScreen() {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Point = require('../../../common/point');
	Client = require('../client');
	Text = require('../canvas/text');
	obj = this;
	SoundCollection = require('../sound-collection');
	this.player = App.player;
	this.opponent = App.opponent;
	this.parallax = Client.parallax;
	this.updateInterval = null;
	Client.start();
	Client.startGame();
};


TrainingScreen.prototype.graphics = function() {
	var player = obj.player;
	var opponent = obj.opponent;
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
};

TrainingScreen.prototype.dispose = function() {
	obj.player.getLifeBar().dispose();
	obj.opponent.getLifeBar().dispose();
};

module.exports = TrainingScreen;