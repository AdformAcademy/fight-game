var App;
var Utilities;
var Point;
var Background;
var Square;
var Text;
var StartScreen;
var obj;

function StageScreen(){
	App = require('../../app.js');
	Utilities = require('../canvas/utilities.js');
	Point = require('../canvas/point.js');
	Background = require('../canvas/background.js');
	Player = require('../player/player.js');
	Text = require('../canvas/text.js');
	StartScreen = require('./start.js');

	console.log('Stage constructor');

	this.backgroundImage = new Background('./img/stage_background.png');
	obj = this;

	this.player = new Player(new Point(0,0));
	this.opponent = new Player(new Point(50,50));

	this.countAnimation = {
		numbers: 3,
		size: 50,
		incrementation: 1,
		opacity: 1,
		opacityStep: 0.01
	};

	this.countDownText = new Text(3, 50);
	this.countDownText.color = '#FFFFFF';

	this.countDownText.location = function() {
		var x = Utilities.centerX(obj.countDownText.textWidth());
		var y = App.canvasObj.height() * 0.5;
		return new Point(x, y);
	};
	
	this.gameStarted = false;
	obj.doCountDown();
};

StageScreen.prototype.doCountDown = function() {
	var oldVal = obj.countAnimation.numbers;
	obj.countAnimation.numbers--;
	obj.countAnimation.size = 50;
	obj.countAnimation.incrementation = 1;
	obj.countAnimation.opacity = 1;
	obj.countAnimation.opacityStep = 0.01;
	if (oldVal <= 0) {
		obj.countDownText.text = 'FIGHT!!!';
		if (oldVal == -1) {
			obj.gameStarted = true;
		}
	} else {
		obj.countDownText.text = oldVal;
	}
	if (oldVal >= 0) {
		setTimeout(obj.doCountDown, 1500);
	}
};

StageScreen.prototype.animateCountDown = function() {
	obj.countAnimation.incrementation += obj.countAnimation.incrementation * 0.095;
	obj.countAnimation.size += obj.countAnimation.incrementation;

	obj.countAnimation.opacityStep += obj.countAnimation.opacityStep * 0.1;
	if (obj.countAnimation.opacity - obj.countAnimation.opacityStep < 0) {
		obj.countAnimation.opacity = 0;
	} else {
		obj.countAnimation.opacity -= obj.countAnimation.opacityStep;
	}
	
	obj.countDownText.size = obj.countAnimation.size;
}

StageScreen.prototype.graphics = function() {
	obj.backgroundImage.draw();
	if (obj.gameStarted) {
		obj.player.draw();
		obj.opponent.draw();
	} else {
		obj.animateCountDown();
		App.canvasObj.canvas.globalAlpha = obj.countAnimation.opacity;
		obj.countDownText.draw();
		App.canvasObj.canvas.restore();
	}
};

module.exports = StageScreen;