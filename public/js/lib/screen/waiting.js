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
	obj = this;

	this.backgroundImage.location = function() {
		return new Point(0, 0);
	};

	this.waitingText.location = function() {
		var x = Utilities.centerX(obj.canvasObj, obj.waitingText.textWidth());
		var y = obj.canvasObj.height() * 0.2;
		return new Point(x, y);
	};
};

WaitingScreen.prototype.graphics = function() {
		obj.backgroundImage.drawBackgroundImage();
		obj.waitingText.draw();
};

module.exports = WaitingScreen;