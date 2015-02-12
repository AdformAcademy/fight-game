var App;
var Utilities;
var Point;
var Text;
var Background;
var StageScreen;
var obj;

function WaitingScreen() {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Point = require('../../../common/point');
	Text = require('../canvas/text');
	Background = require('../canvas/background');
	StageScreen = require('./stage');

	this.backgroundImage = new Background('./img/waiting_screen_background.png');
	this.waitingText = new Text('Waiting for opponent...', 30);
	this.waitingText.color = '#cbcbcb';
	this.waitingText.fontType = 'Arial';
	this.globalAlpha = 1;
	this.globalAlphaStep = 0.04;
	obj = this;

	this.animating = false;
	this.animate();

	this.waitingText.setLocation(function() {
		var x = Utilities.centerX(obj.waitingText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.2;
		return new Point(x, y);
	});
};

WaitingScreen.prototype.animate = function() {
	var self = this;
	self.animating = true;
	var updateInterval = setInterval(function () {
		if (!self.animating) {
			clearInterval(updateInterval);
			return;
		}
		if (self.globalAlpha >= 1 || self.globalAlpha <= 0.15) {
			self.globalAlphaStep *= -1;
		}
		self.globalAlpha += self.globalAlphaStep;
	}, 1000 / 30);
};

WaitingScreen.prototype.graphics = function() {
	obj.backgroundImage.draw();
	App.canvasObj.canvas.globalAlpha = obj.globalAlpha;
	obj.waitingText.draw();
	App.canvasObj.canvas.globalAlpha = 1;
};

WaitingScreen.prototype.dispose = function() {
	App.canvasObj.canvas.globalAlpha = 1;
	App.canvasObj.canvas.restore();
	this.animating = false;
};

module.exports = WaitingScreen;