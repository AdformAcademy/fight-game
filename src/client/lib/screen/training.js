var App;
var Utilities;
var Point;
var Text;
var obj;
var Client;
var Config;
var SoundCollection;
var Button;
var UpdateHandler;
var Config;
var InputCollection;

function TrainingScreen() {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Point = require('../../../common/point');
	Client = require('../client');
	Config = require('../config');
	Text = require('../canvas/text');
	obj = this;
	SoundCollection = require('../sound-collection');
	Button = require('../canvas/button');
	UpdateHandler = require('../utils/update-handler');
	Config = require('../config');
	InputCollection = require('../input-collection');
	this.player = App.player;
	this.opponent = App.opponent;
	this.parallax = Client.parallax;
	this.updateInterval = null;
	Client.start();
	Client.startGame();


	this.waitingText = new Text('Waiting for opponent...', 30);
	this.waitingText.color = Config.fontColor;
	this.waitingText.fontType = 'FSpirit';

	this.loadingText = new Text('You can try out your movements', 30);
	this.loadingText.color = Config.fontColor;
	this.loadingText.fontType = 'FSpirit';

	this.globalAlpha = 1;
	this.globalAlphaStep = 0.04;

	this.animateInterval = null;
	this.animating = false;

	this.animate();

	this.waitingText.setLocation(function() {
		var x = Utilities.centerX(obj.waitingText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.15;
		return new Point(x, y);
	});

	var centerX = Utilities.centerX(this.loadingText.getTextWidth());
	this.loadingText.setLocation(function() {
		var x = centerX;
		var y = App.canvasObj.getHeight() * 0.25;
		return new Point(x, y);
	});

	if (App.isTouchDevice()) {
		this.loadTouchControls();
	}
};

TrainingScreen.prototype.loadTouchControls = function () {
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
			var relativeWidth = self.moveLeftButton.getActiveImage().width;
			var location = self.moveLeftButton.getLocation();

			var x = location.getX() + relativeWidth + 20;
			var y = location.getY();
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
			var location = self.moveLeftButton.getLocation();

			var x = location.getX() - 25;
			var y = location.getY() - relativeHeight;
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
			var relativeHeight = self.kickButton.getActiveImage().height;
			var width = self.jumpButton.getActiveImage().width;
			var location = self.kickButton.getLocation();

			var x = (location.getX() - width) - 5;
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
			var relativeHeight = self.kickButton.getActiveImage().height;
			var location = self.kickButton.getLocation();

			var x = location.getX();
			var y = location.getY() - relativeHeight - 10;
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
			var height = self.kickButton.getActiveImage().height;
			var width = self.kickButton.getActiveImage().width;
			var x = App.canvasObj.getWidth() * 0.88;
			var y = App.canvasObj.getHeight() * 0.97 - height;
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

TrainingScreen.prototype.drawTouchControls = function () {
	this.moveLeftButton.drawButton();
	this.moveRightButton.drawButton();
	this.defendButton.drawButton();
	this.jumpButton.drawButton();
	this.punchButton.drawButton();
	this.kickButton.drawButton();
};

TrainingScreen.prototype.disposeTouchControls = function () {
	this.moveLeftButton.dispose();
	this.moveRightButton.dispose();
	this.defendButton.dispose();
	this.jumpButton.dispose();
	this.punchButton.dispose();
	this.kickButton.dispose();
};

TrainingScreen.prototype.animate = function() {
	var self = this;
	self.animating = true;
	this.animateInterval = setInterval(function () {
		if (!self.animating) {
			clearInterval(self.updateInterval);
			return;
		}
		if (self.globalAlpha >= 1 || self.globalAlpha <= 0.15) {
			self.globalAlphaStep *= -1;
		}
		self.globalAlpha += self.globalAlphaStep;
	}, 1000 / 30);
};

TrainingScreen.prototype.graphics = function() {
	var player = obj.player;
	var opponent = obj.opponent;
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

	if (App.isTouchDevice()) {
		obj.drawTouchControls();
	}

	App.canvasObj.canvas.globalAlpha = obj.globalAlpha;
	obj.waitingText.draw();
	App.canvasObj.canvas.globalAlpha = 1;
	obj.loadingText.draw();
};

TrainingScreen.prototype.dispose = function() {
	obj.player.getLifeBar().dispose();
	obj.opponent.getLifeBar().dispose();
};

TrainingScreen.prototype.dispose = function() {
	App.canvasObj.canvas.globalAlpha = 1;
	App.canvasObj.canvas.restore();
	this.animating = false;
	clearInterval(this.animateInterval);
	if (App.isTouchDevice()) {
		obj.disposeTouchControls();
	}
};

module.exports = TrainingScreen;