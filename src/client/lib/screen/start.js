var App;
var Utilities;
var Button;
var SwitchButton;
var Point;
var Text;
var ChooseWaitingScreen;
var Background;
var socket = io();
var obj;
var InputCollection;
var Config;
var SoundCollection;
var OptionsScreen;

function StartScreen() {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Button = require('../canvas/button');
	SwitchButton = require('../canvas/switch-button');
	Point = require('../../../common/point');
	Text = require('../canvas/text');
	ChooseWaitingScreen = require('./choose-waiting');
	Background = require('../canvas/background');	
	InputCollection = require('../input-collection');
	Config = require('../config');
	SoundCollection = require('../sound-collection');
	OptionsScreen = require('./options');
	
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
	this.optionsButton = new Button ({
		image: './img/options_button.png',
		hoverImage: './img/options_button_hover.png',
		location: function () {
			var x = App.canvasObj.getWidth() - obj.optionsButton.getActiveImage().width - Config.progressBarPadding;
			var y = App.canvasObj.getHeight() - obj.optionsButton.getActiveImage().height - Config.progressBarPadding;
			return new Point(x, y);
		}
	});
	this.startText = new Text('Are you ready to begin a fight?', 30);
	this.startText.setColor('#cbcbcb');
	this.startText.setFontType('Arial');
	obj = this;

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

	this.optionsButton.onClick(function() {
		socket.emit('options', '');
		App.screen = new OptionsScreen();
		App.canvasObj.setGraphics(App.screen.graphics);
		obj.dispose();
	});

	this.optionsButton.mouseOver(function() {
		obj.optionsButton.setActiveImage(obj.optionsButton.getHoverImage());
		obj.optionsButton.hover();
	});

	this.optionsButton.mouseLeave(function() {
		obj.optionsButton.setActiveImage(obj.optionsButton.getImage());
		obj.optionsButton.hoverLeave();
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
	obj.optionsButton.drawButton();
	obj.startText.draw();
};

StartScreen.prototype.dispose = function() {
	this.startButton.dispose();
	this.optionsButton.dispose();
	this.startText.dispose();
};

module.exports = StartScreen;