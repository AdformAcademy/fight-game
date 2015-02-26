var App;
var Utilities;
var Button;
var Point;
var Text;
var ChooseWaitingScreen;
var Background;
var socket = io();
var obj;
var Config;
var SoundCollection;
var StartScreen;

function EndScreen(status, color) {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Button = require('../canvas/button');
	Point = require('../../../common/point');
	Text = require('../canvas/text');
	ChooseWaitingScreen = require('./choose-waiting');
	InputCollection = require('../input-collection');
	Background = require('../canvas/background');	
	Config = require('../config');
	SoundCollection = require('../sound-collection');
	StartScreen = require('./start');
	this.color = color || '#C80000';
	
	this.backgroundImage = new Background('./img/background.png');
	this.startButton = new Button({
		image: './img/start_button.png',
		hoverImage: './img/start_button_hover.png',
		location: function() {
			var x = Utilities.centerX(obj.startButton.getActiveImage().width);
			var y = App.canvasObj.getHeight() * 0.4;
			return new Point(x, y);
		}
	});

	this.backButton = new Button({
		image: './img/back_button.png',
		hoverImage: './img/back_button_hover.png',
		location: function() {
			var x = Config.progressBarPadding;
			var y = App.canvasObj.getHeight() - Config.progressBarPadding - this.getActiveImage().height;
			return new Point(x, y);
		},
	});

	this.tournamentButton = new Button({
		image: './img/tournament_button.png',
		hoverImage: './img/tournament_button_hover.png',
		location: function() {
			var x = Utilities.centerX(obj.tournamentButton.getActiveImage().width);
			var y = App.canvasObj.getHeight() * 0.52;
			return new Point(x, y);
		}
	});

	this.backButton.onClick(function () {
		App.screen = new StartScreen();
		App.canvasObj.setGraphics(App.screen.graphics);
		obj.dispose();
	});

	this.backButton.mouseOver(function () {
		this.setActiveImage(this.getHoverImage());
		this.hover();
	});

	this.backButton.mouseLeave(function () {
		this.setActiveImage(this.getImage());
		this.hoverLeave();
	});

	this.tournamentButton.onClick(function() {
		socket.emit('choose', '');
		App.screen = new ChooseWaitingScreen();
		CharacterChooser.setSocketTarget('tournament');
		Client.setGameType(Client.games.TOURNAMENT);
		App.canvasObj.setGraphics(App.screen.graphics);
		obj.dispose();
	});

	this.tournamentButton.mouseOver(function() {
		obj.tournamentButton.setActiveImage(obj.tournamentButton.getHoverImage());
		obj.tournamentButton.hover();
	});

	this.tournamentButton.mouseLeave(function() {
		obj.tournamentButton.setActiveImage(obj.tournamentButton.getImage());
		obj.tournamentButton.hoverLeave();
	});

	this.endText = new Text(status + '!', 50);
	if(status == "Victory") {
		SoundCollection.play('common', 'victory');
		this.endText.setColor('#00C800');
	} else {
		if(status == "Defeat") {
			SoundCollection.play('player', 'death');
		}
		this.endText.setColor(this.color);
	}
	this.endText.setFontType('FSpirit');
	this.challengeText = new Text('Would you like to try again?', 30);
	this.challengeText.setColor(Config.fontColor);
	this.challengeText.setFontType('FSpirit');
	
	obj = this;

	this.endText.setLocation(function() {
		var x = Utilities.centerX(obj.endText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.2;
		return new Point(x, y);
	});

	this.challengeText.setLocation(function() {
		var x = Utilities.centerX(obj.challengeText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.3;
		return new Point(x, y);
	});

	this.startButton.onClick(function() {
		socket.emit('choose', '');
		App.screen = new ChooseWaitingScreen();
		App.canvasObj.setGraphics(App.screen.graphics);
		obj.dispose();
	});

	this.startButton.mouseOver(function() {
		obj.startButton.setActiveImage(obj.startButton.getHoverImage());
		obj.startButton.hover();
	});

	this.startButton.mouseLeave(function() {
		obj.startButton.setActiveImage(obj.startButton.getImage());
		obj.startButton.hoverLeave();
	});
};

EndScreen.prototype.handleControls = function () {
	var control = InputCollection;
	var keys = Config.keyBindings;
	if(control.isPressed(keys.ENTER)) {
		this.startButton.executeClick();
	}
}

EndScreen.prototype.graphics = function() {
	obj.handleControls();
	obj.backgroundImage.draw();
	obj.startButton.drawButton();
	obj.tournamentButton.drawButton();
	obj.endText.draw();
	obj.challengeText.draw();
	obj.backButton.drawButton();
};

EndScreen.prototype.dispose = function() {
	this.startButton.dispose();
	this.endText.dispose();
	this.challengeText.dispose();
	this.backButton.dispose();
	this.tournamentButton.dispose();
};

module.exports = EndScreen;