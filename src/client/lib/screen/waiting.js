var Utilities = require('../canvas/utilities.js');
var Point = require('../canvas/point.js');
var Text = require('../canvas/text.js');
var Background = require('../canvas/background.js');

var obj;

function WaitingScreen(canvasObj) {
	this.canvasObj = canvasObj;
	this.backgroundImage = new Background('./img/waiting_screen_background.png', 
		canvasObj);
	this.waitingText = new Text(canvasObj, 'Waiting for opponent...', 30);
	this.waitingText.color = '#cbcbcb';
	this.waitingText.fontType = 'Arial';
	this.globalAlpha = 1;
	this.globalAlphaStep = 0.04;
	obj = this;

	this.waitingText.location = function() {
		var x = Utilities.centerX(obj.canvasObj, obj.waitingText.textWidth());
		var y = obj.canvasObj.height() * 0.2;
		return new Point(x, y);
	};
};

WaitingScreen.prototype.animate = function() {
	if (obj.globalAlpha >= 1 || obj.globalAlpha <= 0.15) {
		obj.globalAlphaStep *= -1;
	}
	obj.globalAlpha += obj.globalAlphaStep;
	obj.canvasObj.canvas.globalAlpha = obj.globalAlpha;
};

WaitingScreen.prototype.graphics = function() {
	obj.backgroundImage.draw();
	obj.animate();
	obj.waitingText.draw();
	obj.canvasObj.canvas.globalAlpha = 1;
};

module.exports = WaitingScreen;