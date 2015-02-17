var App;
var Utilities;
var Button;
var Point;
var Text;
var ChooseWaitingScreen;
var CharacterChooser;
var Background;
var socket = io();
var obj;
var InputCollection;
var Config;

function StartScreen() {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Button = require('../canvas/button');
	Point = require('../../../common/point');
	Text = require('../canvas/text');
	ChooseWaitingScreen = require('./choose-waiting');
	CharacterChooser = require('../character-chooser');
	Background = require('../canvas/background');	
	InputCollection = require('../input-collection');
	Config = require('../config');

	this.backgroundImage = new Background('./img/waiting_screen_background.png');
	this.startButton = new Button({
		image: './img/start_button.png',
		hoverImage: './img/start_button_hover.png',
		location: function() {
			var x = Utilities.centerX(obj.startButton.getActiveImage().width);
			var y = App.canvasObj.getHeight() * 0.4;
			return new Point(x, y);
		}
	});

	this.tournamentButton = new Button({
		image: './img/tournament_button.png',
		hoverImage: './img/tournament_button_hover.png',
		location: function() {
			var x = Utilities.centerX(obj.tournamentButton.getActiveImage().width);
			var y = App.canvasObj.getHeight() * 0.5;
			return new Point(x, y);
		}
	});

	this.startText = new Text('Are you ready to begin a fight?', 30);
	this.startText.setColor('#cbcbcb');
	this.startText.setFontType('FSpirit');
	obj = this;

	this.tournamentButton.setLocation(function() {
		var x = Utilities.centerX(obj.tournamentButton.getActiveImage().width);
		var y = App.canvasObj.getHeight() * 0.5;
		return new Point(x, y);
	});

	this.startButton.setLocation(function() {
		var x = Utilities.centerX(obj.startButton.getActiveImage().width);
		var y = App.canvasObj.getHeight() * 0.4;
		return new Point(x, y);
	});

	this.startText.setLocation(function() {
		var x = Utilities.centerX(obj.startText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.2;
		return new Point(x, y);
	});

	this.tournamentButton.onClick(function() {
		socket.emit('choose', '');
		App.screen = new ChooseWaitingScreen();
		CharacterChooser.setSocketTarget('tournament');
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

	this.startButton.onClick(function() {
		socket.emit('choose', '');
		App.screen = new ChooseWaitingScreen();
		CharacterChooser.setSocketTarget('ready');
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

StartScreen.prototype.handleControls = function () {
	var control = InputCollection;
	var keys = Config.keyBindings;
	if(control.isPressed(keys.ENTER)) {
		this.startButton.executeClick();
	}
}

StartScreen.prototype.graphics = function() {
	obj.handleControls();
	obj.backgroundImage.draw();
	obj.startButton.drawButton();
	obj.tournamentButton.drawButton();
	obj.startText.draw();
};

StartScreen.prototype.dispose = function() {
	this.startButton.dispose();
	this.startText.dispose();
	this.tournamentButton.dispose();
};

module.exports = StartScreen;