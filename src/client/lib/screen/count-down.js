var App;
var StageScreen;
var Utilities;
var Point;
var Background;
var Text;
var obj;

function CountDownScreen(){
	App = require('../../app');
	StageScreen = require('./stage');
	Utilities = require('../canvas/utilities');
	Point = require('../../../common/point');
	Background = require('../canvas/background');
	Text = require('../canvas/text');
	this.backgroundImage = new Background('./img/stage_background.png');
	obj = this;

	this.countDownInterval = null;

	this.countAnimation = {
		numbers: 2,
		size: 50,
		incrementation: 1,
		opacity: 1,
		opacityStep: 0.01
	};

	this.countDownText = new Text(3, 50);
	this.countDownText.setColor('#FFFFFF');
	this.animating = false;

	this.countDownText.setLocation(function() {
		var x = Utilities.centerX(obj.countDownText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.5;
		return new Point(x, y);
	});
	this.doCountDown();
	this.animateCountDown();
};

CountDownScreen.prototype.doCountDown = function() {
	this.countDownInterval = setInterval(function () {
		var countAnimation = obj.countAnimation;
		var oldVal = countAnimation.numbers;
		if (oldVal <= 0) {
			obj.countDownText.setText('FIGHT!!!');
			if (oldVal === -1) {
				App.gameStarted = true;
				App.screen = new StageScreen();
				obj.dispose();
				App.canvasObj.setGraphics(App.screen.graphics);
			}
		} else {
			obj.countDownText.setText(oldVal);
		}
		if (oldVal >= 0) {
			clearInterval(this.countDownInterval);
		}
	}, 1500);
};

CountDownScreen.prototype.animateCountDown = function() {
	var self = this;
	var oldValue = self.countDownText.getText();
	self.animating = true;
	var updateInterval = setInterval(function () {
		var currentValue = self.countDownText.getText();
		if (!self.animating) {
			clearInterval(updateInterval);
			return;
		}
		var countAnimation = self.countAnimation;

		if (currentValue !== oldValue) {
			countAnimation.numbers--;
			countAnimation.size = 50;
			countAnimation.incrementation = 1;
			countAnimation.opacity = 1;
			countAnimation.opacityStep = 0.01;
			oldValue = currentValue; 
		}

		countAnimation.incrementation += countAnimation.incrementation * 0.095;
		countAnimation.size += countAnimation.incrementation;

		countAnimation.opacityStep += countAnimation.opacityStep * 0.1;
		if (countAnimation.opacity - countAnimation.opacityStep < 0) {
			countAnimation.opacity = 0;
		} else {
			countAnimation.opacity -= countAnimation.opacityStep;
		}
		self.countDownText.setSize(self.countAnimation.size);
	}, 1000 / 30);
};

CountDownScreen.prototype.graphics = function() {
	App.canvasObj.canvas.globalAlpha = 1;
	obj.backgroundImage.draw();
	App.canvasObj.canvas.globalAlpha = obj.countAnimation.opacity;
	obj.countDownText.draw();
	App.canvasObj.canvas.restore();
};

CountDownScreen.prototype.dispose = function() {
	clearInterval(this.countDownInterval);
	App.canvasObj.canvas.globalAlpha = 1;
	App.canvasObj.canvas.restore();
	this.animating = false;
};

module.exports = CountDownScreen;