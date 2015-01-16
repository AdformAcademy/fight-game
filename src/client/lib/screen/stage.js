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
	obj.backgroundImage.draw();
	if (obj.player.getDepth() > obj.opponent.getDepth()) {
		obj.player.draw();
		obj.opponent.draw();
	} else {
		obj.opponent.draw();
		obj.player.draw();
	}
};

StageScreen.prototype.dispose = function() {
};

module.exports = StageScreen;