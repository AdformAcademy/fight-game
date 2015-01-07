var App;
var Client;
var Point;
var Background;
var obj;

function StageScreen() {
	App = require('../../app');
	Client = require('../client');
	Point = require('../canvas/point');
	Background = require('../canvas/background');

	this.backgroundImage = new Background('./img/stage_background.png');
	obj = this;

	Client.start();
};

StageScreen.prototype.graphics = function() {
	obj.backgroundImage.draw();
	App.player.draw();
	App.opponent.draw();
};

StageScreen.prototype.dispose = function() {
};

module.exports = StageScreen;