var Utilities = require('../canvas/utilities.js');
var Point = require('../canvas/point.js');
var Text = require('../canvas/text.js');

var obj;

function WaitinScreen(canvasObj) {
	this.canvasObj = canvasObj;
	this.waitingText = new Text(canvasObj, 'Waiting for opponent...', 30);
	this.waitingText.color = '#cbcbcb';
	this.waitingText.fontType = 'Arial';
	obj = this;

	this.waitingText.location = function() {
		var x = Utilities.centerX(obj.canvasObj, obj.waitingText.textWidth());
		var y = obj.canvasObj.height() * 0.2;
		return new Point(x, y);
	};
};

WaitinScreen.prototype.graphics = function() {
	obj.waitingText.draw();
};

module.exports = WaitinScreen;