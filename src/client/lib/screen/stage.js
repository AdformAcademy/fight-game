var App;
var GlobalEvents;
var Utilities;
var Point;
var Background;
var Square;
var Text;
var StartScreen;
var obj;
var socket = io();

function StageScreen(){
	App = require('../../app.js');
	GlobalEvents = require('../global-events.js');
	Utilities = require('../canvas/utilities.js');
	Point = require('../canvas/point.js');
	Background = require('../canvas/background.js');
	Text = require('../canvas/text.js');
	StartScreen = require('./start.js');

	console.log('Stage constructor');

	this.backgroundImage = new Background('./img/stage_background.png');
	obj = this;

	App.player.location = new Point(0,0);
	App.opponent.location = new Point(50, 50);

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
	
	App.gameStarted = false;
	obj.doCountDown();
};

StageScreen.prototype.doCountDown = function() {
	var countAnimation = obj.countAnimation;
	var oldVal = countAnimation.numbers;
	countAnimation.numbers--;
	countAnimation.size = 50;
	countAnimation.incrementation = 1;
	countAnimation.opacity = 1;
	countAnimation.opacityStep = 0.01;
	if (oldVal <= 0) {
		obj.countDownText.text = 'FIGHT!!!';
		if (oldVal == -1) {
			App.gameStarted = true;
		}
	} else {
		obj.countDownText.text = oldVal;
	}
	if (oldVal >= 0) {
		setTimeout(obj.doCountDown, 1500);
	}
};

StageScreen.prototype.animateCountDown = function() {
	var countAnimation = obj.countAnimation;
	countAnimation.incrementation += countAnimation.incrementation * 0.095;
	countAnimation.size += countAnimation.incrementation;

	countAnimation.opacityStep += countAnimation.opacityStep * 0.1;
	if (countAnimation.opacity - countAnimation.opacityStep < 0) {
		countAnimation.opacity = 0;
	} else {
		countAnimation.opacity -= countAnimation.opacityStep;
	}
	
	obj.countDownText.size = obj.countAnimation.size;
};

StageScreen.prototype.playerMove = function() {
	var key = GlobalEvents.Key;
	if (key.isDown(key.RIGHT)) {
		socket.emit('move', key.RIGHT);
	}
	if (key.isDown(key.LEFT)) {
		socket.emit('move', key.LEFT);
	}
	if (key.isDown(key.UP)) {
		socket.emit('move', key.UP);
	}
	if (key.isDown(key.DOWN)) {
		socket.emit('move', key.DOWN);
	}
};

StageScreen.prototype.graphics = function() {
	obj.backgroundImage.draw();
	if (App.gameStarted) {
		obj.playerMove();
		App.player.draw();
		App.opponent.draw();
	} else {
		obj.animateCountDown();
		App.canvasObj.canvas.globalAlpha = obj.countAnimation.opacity;
		obj.countDownText.draw();
		App.canvasObj.canvas.restore();
	}
};

module.exports = StageScreen;