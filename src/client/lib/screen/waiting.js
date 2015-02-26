var App;
var Utilities;
var Point;
var Text;
var Background;
var StageScreen;
var Config;
var obj;

function WaitingScreen() {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Point = require('../../../common/point');
	Text = require('../canvas/text');
	Background = require('../canvas/background');
	StageScreen = require('./stage');
	Config = require('../config');

	this.backgroundImage = new Background('./img/background.png');
	this.waitingText = new Text('Waiting for opponent...', 30);
	this.waitingText.color = Config.fontColor;
	this.waitingText.fontType = 'FSpirit';

	this.loadingText = new Text('Loading', 30);
	this.loadingText.color = Config.fontColor;
	this.loadingText.fontType = 'FSpirit';

	this.globalAlpha = 1;
	this.globalAlphaStep = 0.04;
	obj = this;

	this.animateInterval = null;
	this.animating = false;
	this.opponentFound = false;

	this.loadingValue = 0;
	this.dots = 0;
	this.animateLoadingInterval = null;

	this.animate();

	this.waitingText.setLocation(function() {
		var x = Utilities.centerX(obj.waitingText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.2;
		return new Point(x, y);
	});

	var centerX = Utilities.centerX(this.loadingText.getTextWidth());
	this.loadingText.setLocation(function() {
		var x = centerX;
		var y = App.canvasObj.getHeight() * 0.35;
		return new Point(x, y);
	});
};

WaitingScreen.prototype.animate = function() {
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

WaitingScreen.prototype.animateLoading = function() {
	var self = this;
	this.animateLoadingInterval = setInterval(function () {
		var dots = [];
		self.loadingValue += 0.07;
		if (self.loadingValue > 1) {
			self.loadingValue = 0;
			self.dots++;
			if (self.dots > 3) {
				self.dots = 0;
			}
		}
		for (var i = 0; i < self.dots; i++) {
			dots.push('.');
		}
		self.loadingText.setText('Loading' + dots.join(''));
	}, 1000 / 30);
};

WaitingScreen.prototype.load = function () {
	this.opponentFound = true;
	this.animating = false;
	this.globalAlpha = 1;
	this.waitingText.setText('Opponent found');
	clearInterval(this.animateInterval);
	this.animateLoading();
};

WaitingScreen.prototype.graphics = function() {
	obj.backgroundImage.draw();
	App.canvasObj.canvas.globalAlpha = obj.globalAlpha;
	obj.waitingText.draw();
	if (obj.opponentFound) {
		obj.loadingText.draw();
	}
	App.canvasObj.canvas.globalAlpha = 1;
};

WaitingScreen.prototype.dispose = function() {
	App.canvasObj.canvas.globalAlpha = 1;
	App.canvasObj.canvas.restore();
	this.animating = false;
	clearInterval(this.animateInterval);
	clearInterval(this.animateLoadingInterval);
};

module.exports = WaitingScreen;