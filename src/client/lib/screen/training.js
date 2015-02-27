var App;
var Utilities;
var Point;
var Text;
var obj;
var Client;
var Config;
var SoundCollection;

function TrainingScreen() {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Point = require('../../../common/point');
	Client = require('../client');
	Config = require('../config');
	Text = require('../canvas/text');
	obj = this;
	SoundCollection = require('../sound-collection');
	this.player = App.player;
	this.opponent = App.opponent;
	this.parallax = Client.parallax;
	this.updateInterval = null;
	Client.start();
	Client.startGame();


	this.waitingText = new Text('Waiting for opponent...', 30);
	this.waitingText.color = Config.fontColor;
	this.waitingText.fontType = 'FSpirit';

	this.loadingText = new Text('You can try out your movements', 30);
	this.loadingText.color = Config.fontColor;
	this.loadingText.fontType = 'FSpirit';

	this.globalAlpha = 1;
	this.globalAlphaStep = 0.04;

	this.animateInterval = null;
	this.animating = false;

	this.animate();

	this.waitingText.setLocation(function() {
		var x = Utilities.centerX(obj.waitingText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.15;
		return new Point(x, y);
	});

	var centerX = Utilities.centerX(this.loadingText.getTextWidth());
	this.loadingText.setLocation(function() {
		var x = centerX;
		var y = App.canvasObj.getHeight() * 0.25;
		return new Point(x, y);
	});
};

TrainingScreen.prototype.animate = function() {
	var self = this;
	self.animating = true;
	this.animateInterval = setInterval(function () {
		if (!self.animating) {
			clearInterval(self.updateInterval);
			return;
		}
		if (self.globalAlpha >= 1 || self.globalAlpha <= 0.15) {
			self.globalAlphaStep *= -1;
		}
		self.globalAlpha += self.globalAlphaStep;
	}, 1000 / 30);
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
	App.canvasObj.canvas.globalAlpha = obj.globalAlpha;
	obj.waitingText.draw();
	App.canvasObj.canvas.globalAlpha = 1;
	obj.loadingText.draw();
};

TrainingScreen.prototype.dispose = function() {
	obj.player.getLifeBar().dispose();
	obj.opponent.getLifeBar().dispose();
};

TrainingScreen.prototype.dispose = function() {
	App.canvasObj.canvas.globalAlpha = 1;
	App.canvasObj.canvas.restore();
	this.animating = false;
	clearInterval(this.animateInterval);
};

module.exports = TrainingScreen;