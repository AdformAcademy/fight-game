var App;
var Utilities;
var Point;
var Text;
var Background;
var obj;

var ChooseWaitingScreen = function () {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Point = require('../../../common/point');
	Text = require('../canvas/text');
	Background = require('../canvas/background');	

	this.backgroundImage = new Background('./img/waiting_screen_background.png');
	this.infoText = new Text('Choose character', 30);
	this.infoText.color = '#cbcbcb';
	this.infoText.fontType = 'Arial';

	this.infoText.setLocation(function() {
		var x = Utilities.centerX(obj.infoText.getTextWidth());;
		var y = App.canvasObj.getHeight() * 0.15;
		return new Point(x, y);
	});

	obj = this;
};

ChooseWaitingScreen.prototype.graphics = function() {
	obj.backgroundImage.draw();
	obj.infoText.draw();
};

ChooseWaitingScreen.prototype.dispose = function() {
};

module.exports = ChooseWaitingScreen;