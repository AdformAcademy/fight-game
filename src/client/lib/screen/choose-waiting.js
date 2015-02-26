var App;
var Utilities;
var Button;
var Point;
var Text;
var Background;
var socket = io();
var obj;

var ChooseWaitingScreen = function () {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Point = require('../../../common/point');
	Text = require('../canvas/text');
	Background = require('../canvas/background');	

	this.backgroundImage = new Background('./img/background.png');
	this.loadingText = new Text('Loading', 30);
	this.loadingText.color = Config.fontColor;
	this.loadingText.fontType = 'FSpirit';
	this.loadingValue = 0;
	this.dots = 0;
	this.loaded = false;

	var centerX = Utilities.centerX(this.loadingText.getTextWidth());

	this.loadingText.setLocation(function() {
		var x = centerX;
		var y = App.canvasObj.getHeight() * 0.15;
		return new Point(x, y);
	});

	obj = this;
};

ChooseWaitingScreen.prototype.animateLoading = function() {
	var dots = [];
	obj.loadingValue += 0.07;
	if (obj.loadingValue > 1) {
		obj.loadingValue = 0;
		obj.dots++;
		if (obj.dots > 3) {
			obj.dots = 0;
		}
	}
	for (var i = 0; i < obj.dots; i++) {
		dots.push('.');
	}
	obj.loadingText.setText('Loading' + dots.join(''));
};

ChooseWaitingScreen.prototype.graphics = function() {
	obj.backgroundImage.draw();
	obj.animateLoading();
	obj.loadingText.draw();
	App.canvasObj.canvas.globalAlpha = 1;
};

ChooseWaitingScreen.prototype.dispose = function() {
	App.canvasObj.canvas.globalAlpha = 1;
};

module.exports = ChooseWaitingScreen;