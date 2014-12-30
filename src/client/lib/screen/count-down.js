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
	Point = require('../canvas/point');
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

	this.countDownText.setLocation(function() {
		var x = Utilities.centerX(obj.countDownText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.5;
		return new Point(x, y);
	});
	this.doCountDown();
};

CountDownScreen.prototype.doCountDown = function() {
	this.countDownInterval = setInterval(function () {
		var countAnimation = obj.countAnimation;
		var oldVal = countAnimation.numbers;
		console.log(countAnimation.numbers);
		countAnimation.numbers--;
		countAnimation.size = 50;
		countAnimation.incrementation = 1;
		countAnimation.opacity = 1;
		countAnimation.opacityStep = 0.01;
		if (oldVal <= 0) {
			obj.countDownText.setText('FIGHT!!!');
			if (oldVal == -1) {
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
	var countAnimation = obj.countAnimation;
	countAnimation.incrementation += countAnimation.incrementation * 0.095;
	countAnimation.size += countAnimation.incrementation;

	countAnimation.opacityStep += countAnimation.opacityStep * 0.1;
	if (countAnimation.opacity - countAnimation.opacityStep < 0) {
		countAnimation.opacity = 0;
	} else {
		countAnimation.opacity -= countAnimation.opacityStep;
	}
	
	obj.countDownText.setSize(obj.countAnimation.size);
};

CountDownScreen.prototype.graphics = function() {
	App.canvasObj.canvas.globalAlpha = 1;
	obj.backgroundImage.draw();
	obj.animateCountDown();
	App.canvasObj.canvas.globalAlpha = obj.countAnimation.opacity;
	obj.countDownText.draw();
	App.canvasObj.canvas.restore();
};

CountDownScreen.prototype.dispose = function() {
	clearInterval(this.countDownInterval);
	App.canvasObj.canvas.globalAlpha = 1;
	App.canvasObj.canvas.restore();
};

module.exports = CountDownScreen;