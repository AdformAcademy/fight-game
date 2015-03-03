var App;
var Utilities;
var Point;
var Text;
var obj;
var Client;
var SoundCollection;
var SpriteSheet;
var Button;
var UpdateHandler;
var Config;
var InputCollection;

function StageScreen() {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Point = require('../../../common/point');
	Client = require('../client');
	Text = require('../canvas/text');
	SpriteSheet = require('../canvas/spritesheet');
	Button = require('../canvas/button');
	UpdateHandler = require('../utils/update-handler');
	Config = require('../config');
	InputCollection = require('../input-collection');
	obj = this;

	SoundCollection = require('../sound-collection');
	this.player = App.player;
	this.opponent = App.opponent;
	this.parallax = Client.parallax;

	var playerImagePath = this.player.getData().spriteSheetButton.spriteSheetIntroImage;
	var pimage = new Image();
	pimage.src = './img/characters/' + playerImagePath;
	this.playerImage = new SpriteSheet({
		image: pimage,
		data: {
			spriteDimensions: {
				width: 4160,
				height: 164,
				frameWidth: 212,
				frameHeight: 164
			},
			animations: {
				animation: {
					name: 'introAnimation',
					startFrame: 7,
					frames: 1,
					speed: 0,
					order: 'dsc',
					row: 0
				}
			},
			defaultAnimation: 'animation'
		},
		useScale: true,
		scaleWidth: 65,
		scaleHeight: 65
	});

	var opponentImagePath = this.opponent.getData().spriteSheetButton.spriteSheetIntroImage;
	var oimage = new Image();
	oimage.src = './img/characters/' + opponentImagePath;
	this.opponentImage = new SpriteSheet({
		image: oimage,
		data: {
			spriteDimensions: {
				width: 4160,
				height: 164,
				frameWidth: 212,
				frameHeight: 164
			},
			animations: {
				animation: {
					name: 'introAnimation',
					startFrame: 7,
					frames: 1,
					speed: 0,
					order: 'dsc',
					row: 0
				}
			},
			defaultAnimation: 'animation'
		},
		useScale: true,
		scaleWidth: 65,
		scaleHeight: 65
	});

	this.playerName = new Text(this.player.getName(), 20);
	this.playerName.setColor('#FFFFFF');
	this.playerName.setFontType('FSpirit');

	this.playerName.setLocation(function() {
		var player = App.player;
		var energybar = player.getEnergyBar();
		var location = energybar.getLocation();
		var y = location.getY() + 50;
		if (location.getX() <= 200) {
			return new Point(location.getX(), y);
		} else {
			return new Point(location.getX() + 110, y);
		}
	});

	this.opponentName = new Text(this.opponent.getName(), 20);
	this.opponentName.setColor('#FFFFFF');
	this.opponentName.setFontType('FSpirit');

	this.opponentName.setLocation(function() {
		var opponent = App.opponent;
		var energybar = opponent.getEnergyBar();
		var location = energybar.getLocation();
		var y = location.getY() + 50;
		if (location.getX() <= 200) {
			return new Point(location.getX(), y);
		} else {
			return new Point(location.getX() + 110, y);
		}
	});

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

	if (App.isTouchDevice()) {
		this.loadTouchControls();
	}
};

StageScreen.prototype.loadTouchControls = function () {
	var self = this;
	var keys = Config.keyBindings;

	var moveLeftHandler = new UpdateHandler(function () {
		InputCollection.onKeydown({
			keyCode: keys.LEFT
		});
	}, 1000 / 30);

	var moveRightHandler = new UpdateHandler(function () {
		InputCollection.onKeydown({
			keyCode: keys.RIGHT
		});
	}, 1000 / 30);

	var defendHandler = new UpdateHandler(function () {
		InputCollection.onKeydown({
			keyCode: keys.DEFEND
		});
	}, 1000 / 30);

	this.moveLeftButton = new Button({
		image: './img/controls/left.png',
		hoverImage: './img/controls/left.png',
		location: function() {
			var height = self.moveLeftButton.getActiveImage().height;
			var width = self.moveLeftButton.getActiveImage().width;
			var x = App.canvasObj.getWidth() * 0.04;
			var y = App.canvasObj.getHeight() * 0.97 - height;
			return new Point(x, y);
		},
		touchStartEvent: function () {
			moveLeftHandler.start();
		},
		touchEndEvent: function () {
			moveLeftHandler.stop();
			InputCollection.onKeyup({
				keyCode: keys.LEFT
			});
		},
		touchResetEvent: function () {
			moveLeftHandler.stop();
			InputCollection.onKeyup({
				keyCode: keys.LEFT
			});
		}
	});

	this.moveRightButton = new Button({
		image: './img/controls/right.png',
		hoverImage: './img/controls/right.png',
		location: function() {
			var height = self.moveLeftButton.getActiveImage().height;
			var width = self.moveLeftButton.getActiveImage().width;
			var x = App.canvasObj.getWidth() * 0.9;
			var y = App.canvasObj.getHeight() * 0.97 - height;
			return new Point(x, y);
		},
		touchStartEvent: function () {
			moveRightHandler.start();
		},
		touchEndEvent: function () {
			moveRightHandler.stop();
			InputCollection.onKeyup({
				keyCode: keys.RIGHT
			});
		},
		touchResetEvent: function () {
			moveRightHandler.stop();
			InputCollection.onKeyup({
				keyCode: keys.RIGHT
			});
		}
	});

	this.defendButton = new Button({
		image: './img/controls/defend.png',
		hoverImage: './img/controls/defend.png',
		location: function() {
			var relativeHeight = self.moveLeftButton.getActiveImage().height;
			var relativeWidth = self.moveLeftButton.getActiveImage().width;
			var location = self.moveLeftButton.getLocation();

			var x = (location.getX() + relativeWidth) + 10;
			var y = location.getY() - relativeHeight * 0.6;
			return new Point(x, y);
		},
		touchStartEvent: function () {
			defendHandler.start();
		},
		touchEndEvent: function () {
			defendHandler.stop();
			InputCollection.onKeyup({
				keyCode: keys.DEFEND
			});
		},
		touchResetEvent: function () {
			defendHandler.stop();
			InputCollection.onKeyup({
				keyCode: keys.DEFEND
			});
		}
	});

	this.jumpButton = new Button({
		image: './img/controls/jump.png',
		hoverImage: './img/controls/jump.png',
		location: function() {
			var relativeHeight = self.moveRightButton.getActiveImage().height;
			var width = self.jumpButton.getActiveImage().width;
			var location = self.moveRightButton.getLocation();

			var x = (location.getX() - width) - 10;
			var y = location.getY() - relativeHeight * 0.6;
			return new Point(x, y);
		},
		touchStartEvent: function () {
			InputCollection.onKeydown({
				keyCode: keys.JUMP
			});
		},
		touchEndEvent: function () {
			InputCollection.onKeyup({
				keyCode: keys.JUMP
			});
		},
		touchResetEvent: function () {
			InputCollection.pressed[keys.JUMP] = false;
		}
	});

	this.punchButton = new Button({
		image: './img/controls/punch.png',
		hoverImage: './img/controls/punch.png',
		location: function() {
			var relativeHeight = self.moveLeftButton.getActiveImage().height;
			var location = self.moveLeftButton.getLocation();

			var x = location.getX() - 25;
			var y = location.getY() - relativeHeight;
			return new Point(x, y);
		},
		touchStartEvent: function () {
			InputCollection.onKeydown({
				keyCode: keys.PUNCH
			});
		},
		touchEndEvent: function () {
			InputCollection.onKeyup({
				keyCode: keys.PUNCH
			});
		},
		touchResetEvent: function () {
			InputCollection.pressed[keys.PUNCH] = false;
		}
	});

	this.kickButton = new Button({
		image: './img/controls/kick.png',
		hoverImage: './img/controls/kick.png',
		location: function() {
			var relativeHeight = self.moveRightButton.getActiveImage().height;
			var location = self.moveRightButton.getLocation();

			var x = location.getX();
			var y = location.getY() - relativeHeight;
			return new Point(x, y);
		},
		touchStartEvent: function () {
			InputCollection.onKeydown({
				keyCode: keys.KICK
			});
		},
		touchEndEvent: function () {
			InputCollection.onKeyup({
				keyCode: keys.KICK
			});
		},
		touchResetEvent: function () {
			InputCollection.pressed[keys.KICK] = false;
		}
	});
};

StageScreen.prototype.drawTouchControls = function () {
	this.moveLeftButton.drawButton();
	this.moveRightButton.drawButton();
	this.defendButton.drawButton();
	this.jumpButton.drawButton();
	this.punchButton.drawButton();
	this.kickButton.drawButton();
};

StageScreen.prototype.disposeTouchControls = function () {
	this.moveLeftButton.dispose();
	this.moveRightButton.dispose();
	this.defendButton.dispose();
	this.jumpButton.dispose();
	this.punchButton.dispose();
	this.kickButton.dispose();
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

	var playerImageLocation = playerEnergyBar.getLocation();
	var pImageX = playerImageLocation.getX();
	var pImageY = playerImageLocation.getY() + 60;

	var opponentImageLocation = opponentEnergyBar.getLocation();
	var oImageX = opponentImageLocation.getX();
	var oImageY = opponentImageLocation.getY() + 60;
	
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

	obj.playerName.draw();
	obj.opponentName.draw();

	if (playerImageLocation.getX() <= 100) {
		oImageX += 115;
	} else if (opponentImageLocation.getX() <= 100) {
		pImageX += 115;
	}

	obj.playerImage.draw(pImageX, pImageY);
	obj.opponentImage.draw(oImageX, oImageY);

	if (App.isTouchDevice()) {
		obj.drawTouchControls();
	}

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
	if (App.isTouchDevice()) {
		obj.disposeTouchControls();
	}
};

module.exports = StageScreen;