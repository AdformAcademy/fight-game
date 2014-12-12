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
	Point = require('../canvas/point');
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

	this.waitingText.location = function() {
		var x = Utilities.centerX(obj.waitingText.textWidth());
		var y = App.canvasObj.height() * 0.2;
		return new Point(x, y);
	};
};

WaitingScreen.prototype.animate = function() {
	if (obj.globalAlpha >= 1 || obj.globalAlpha <= 0.15) {
		obj.globalAlphaStep *= -1;
	}
	obj.globalAlpha += obj.globalAlphaStep;
	App.canvasObj.canvas.globalAlpha = obj.globalAlpha;
};

WaitingScreen.prototype.graphics = function() {
	obj.backgroundImage.draw();
	obj.animate();
	obj.waitingText.draw();
	App.canvasObj.canvas.globalAlpha = 1;
};

module.exports = WaitingScreen;