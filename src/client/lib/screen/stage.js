var App;
var Utilities;
var Point;
var Text;
var obj;
var Client;
var SoundCollection;

function StageScreen() {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Point = require('../../../common/point');
	Client = require('../client');
	Text = require('../canvas/text');
	obj = this;

	SoundCollection = require('../sound-collection');
	this.player = App.player;
	this.opponent = App.opponent;
	this.parallax = Client.parallax;

	this.countDownInterval = null;
	this.updateInterval = null;
	this.countAnimation = {
		numbers: 2,
		size: 50,
		incrementation: 1,
		opacity: 1,
		opacityStep: 0.01
	};

	this.timerText = new Text(999, 30);
	this.timerText.color = '#FFFFFF';
	this.timerText.fontType = 'FSpirit';

	this.timerText.setLocation(function() {
		var x = Utilities.centerX(obj.timerText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.15;
		return new Point(x, y);
	});

	this.countDownText = new Text(3, 50);
	this.countDownText.setColor('#FFFFFF');
	this.countDownText.setFontType('FSpirit');
	this.animatingCountDown = false;

	this.countDownText.setLocation(function() {
		var x = Utilities.centerX(obj.countDownText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.5;
		return new Point(x, y);
	});


	this.endText = new Text('', 100);
	this.endText.setColor('#FFFFFF');
	this.endText.setFontType('FSpirit');
	this.endText.visible = false;

	this.endText.setLocation(function() {
		var x = Utilities.centerX(obj.endText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.5;
		return new Point(x, y);
	})


	this.doCountDown();
	this.animateCountDown();
	Client.start();
	SoundCollection.play('common', 'theme');
};

StageScreen.prototype.stageTimerUpdate = function(data) {
	var time = data.fightTimer;
	if(obj.timerText !== null) {
		if (time <= 10) {
			obj.timerText.setColor('#ED1C1C');
		}
		obj.timerText.setText(time);	
	}
};

StageScreen.prototype.doCountDown = function() {
	this.countDownInterval = setInterval(function () {
		var countAnimation = obj.countAnimation;
		var oldVal = countAnimation.numbers;
		if (oldVal <= 0) {
			obj.countDownText.setText('FIGHT!!!');
			if (oldVal === -1) {
				obj.disposeCountDown();
				Client.startGame();
			}
		} else {
			obj.countDownText.setText(oldVal);
		}
		if (oldVal >= 0) {
			clearInterval(this.countDownInterval);
		}
	}, 1500);
};

StageScreen.prototype.animateCountDown = function() {
	var self = this;
	var oldValue = self.countDownText.getText();
	self.animatingCountDown = true;
	this.updateInterval = setInterval(function () {
		var currentValue = self.countDownText.getText();
		if (!self.animatingCountDown) {
			clearInterval(self.updateInterval);
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

StageScreen.prototype.animateEndText = function (text, color) {
	var self = this;
	this.endText.setText(text);
	if (color !== undefined) {
		this.endText.setColor(color);
	}
	this.endText.visible = true;

	var textSize = this.endText.getSize();
	var incrementation = 1;

	var animateInterval = setInterval(function () {
		incrementation += incrementation * 0.095;
		textSize -= incrementation;

		self.endText.setSize(textSize);
		if (textSize < 50) {
			textSize = 50;
			self.endText.setSize(textSize);
			clearInterval(animateInterval);
		}
	}, 1000 / 30);
};

StageScreen.prototype.graphics = function() {
	var player = obj.player;
	var opponent = obj.opponent;
	var playerLifeBar = player.getLifeBar();
	var opponentLifebar = opponent.getLifeBar();
	var playerEnergyBar = player.getEnergyBar();
	var opponentEnergyBar = opponent.getEnergyBar();
	var xView = Client.camera.xView;
	var yView = Client.camera.yView;
	
	obj.parallax.draw();
	if (player.getDepth() > opponent.getDepth()) {
		player.draw(xView, yView);
		opponent.draw(xView, yView);
	} else {
		opponent.draw(xView, yView);
		player.draw(xView, yView);
	}
	playerLifeBar.draw();
	playerEnergyBar.draw();
	opponentLifebar.draw();
	opponentEnergyBar.draw();

	if (Client.getGameType() === Client.games.TOURNAMENT) {
		obj.timerText.draw();
	}

	obj.endText.draw();

	if (obj.animatingCountDown) {
		App.canvasObj.canvas.save();
		App.canvasObj.canvas.globalAlpha = obj.countAnimation.opacity;
		obj.countDownText.draw();
		App.canvasObj.canvas.restore();
	}
};

StageScreen.prototype.disposeCountDown = function () {
	clearInterval(this.countDownInterval);
	clearInterval(this.updateInterval);
	App.canvasObj.canvas.globalAlpha = 1;
	App.canvasObj.canvas.restore();
	this.animatingCountDown = false;
};

StageScreen.prototype.dispose = function() {
	obj.player.getLifeBar().dispose();
	obj.opponent.getLifeBar().dispose();
	obj.disposeCountDown();
};

module.exports = StageScreen;