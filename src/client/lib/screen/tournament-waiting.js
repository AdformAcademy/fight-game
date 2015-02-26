var App;
var Utilities;
var Point;
var Text;
var Background;
var StageScreen;
var SpriteSheet = require('../canvas/spritesheet');
var Config = require('../config');
var fs = require('fs');
var socket = io();
var obj;

function TournamentWaitingScreen() {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Point = require('../../../common/point');
	Text = require('../canvas/text');
	Background = require('../canvas/background');
	StageScreen = require('./stage');

	this.images = [];
	this.canvas = App.canvasObj.canvas;
	this.backgroundImage = new Background('./img/tournament_waiting.png');
	this.waitingText = new Text('Waiting for players, 0/8 ready', 30);
	this.waitingText.color = '#cbcbcb';
	this.waitingText.fontType = 'FSpirit';

	this.waitingText2 = new Text('Game will start in: 60', 30);
	this.waitingText2.color = '#cbcbcb';
	this.waitingText2.fontType = 'FSpirit';

	this.loadingText = new Text('Loading', 30);
	this.loadingText.color = '#cbcbcb';
	this.loadingText.fontType = 'FSpirit';

	this.versusText = new Text('VS', 80);
	this.versusText.color = '#cbcbcb';
	this.versusText.fontType = 'FSpirit';

	obj = this;

	this.animateInterval = null;
	this.animating = false;
	this.opponentFound = false;

	this.loadingValue = 0;
	this.dots = 0;

	this.tournamentBegan = false;

	this.waitingText.setLocation(function() {
		var x = Utilities.centerX(obj.waitingText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.1;
		return new Point(x, y);
	});

	this.waitingText2.setLocation(function() {
		var x = Utilities.centerX(obj.waitingText2.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.2;
		return new Point(x, y);
	});

	var centerX = Utilities.centerX(this.loadingText.getTextWidth());
	this.loadingText.setLocation(function() {
		var x = centerX;
		var y = App.canvasObj.getHeight() * 0.2;
		return new Point(x, y);
	});
};

TournamentWaitingScreen.prototype.loadImages = function (data) {
	for (var i = 0; i < data.ids.length; i++) {
		var spriteImage = new Image();
		console.log(data.chars[data.ids[i]-1]);
		spriteImage.src = data.chars[data.ids[i]-1];
		var spriteSheet = new SpriteSheet({
			image: spriteImage,
			data: {
				spriteDimensions: {
					width: 4160,
					height: 164,
					frameWidth: 212
				},
				animations: {
					animation: {
						name: 'introAnimation',
						startFrame: 2,
						frames: 1,
						speed: 0,
						order: 'dsc'
					}
				},
				defaultAnimation: 'animation'
			},
			useScale: true,
			scaleWidth: 100,
			scaleHeight: 100
		});
		this.images.push(spriteSheet);
	}
};

TournamentWaitingScreen.prototype.update = function (data) {
	if (data.started) {
		if (!this.tournamentBegan) {
			this.tournamentBegan = true;
			this.loadImages(data);
		}
	} else {
		this.waitingText.setText('Waiting for players, ' + data.pairs + '/8 ready');
		this.waitingText2.setText('Game will start in: ' + data.timer);
	}
};

TournamentWaitingScreen.prototype.animateLoading = function() {
	var self = this;
	this.animateLoadingInterval = setInterval(function () {
		var dots = [];
		self.loadingValue += 0.07;
		if (self.loadingValue > 1) {
			self.loadingValue = 0;
			self.dots++;
			if (self.dots > 3) {
				self.dots = 0;
			}
		}
		for (var i = 0; i < self.dots; i++) {
			dots.push('.');
		}
		self.loadingText.setText('Loading' + dots.join(''));
	}, 1000 / 30);
};

TournamentWaitingScreen.prototype.load = function () {
	this.opponentFound = true;
	this.animating = false;
	this.waitingText.setText('Opponent found');
	clearInterval(this.animateInterval);
	this.animateLoading();
};

TournamentWaitingScreen.prototype.graphics = function() {
	obj.backgroundImage.draw();
	if (!obj.tournamentBegan) {
		obj.waitingText.draw();
		obj.waitingText2.draw();
	} else {
		console.log('test-------------------------------------------' + obj.images.length);
		obj.versusText.setLocation(function() {
			var x = Utilities.centerX(obj.versusText.getTextWidth());
			var y = obj.images.length/2 * 50 + 150;
			return new Point(x, y);
		});
		obj.versusText.draw();
		for (var i = 0; i < obj.images.length; i++) {
			var image = obj.images[i];
			if(i % 2 == 0)
				image.draw(250, 50*(i+1) + 50);
			else
				image.draw(550, 50*(i) + 50);
		}
	}
	if (obj.opponentFound) {
		obj.loadingText.draw();
	}
};

TournamentWaitingScreen.prototype.dispose = function() {
	App.canvasObj.canvas.restore();
	this.animating = false;
	clearInterval(this.animateInterval);
	clearInterval(this.animateLoadingInterval);
};

module.exports = TournamentWaitingScreen;