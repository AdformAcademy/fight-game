var App;
var Utilities;
var Point;
var Text;
var Background;
var obj;
var Button;
var Config;
var StartScreen;
var CharacterChooser;

var ChooseScreen = function () {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Point = require('../../../common/point');
	Text = require('../canvas/text');
	Background = require('../canvas/background');	
	Button = require('../canvas/button');
	Config = require('../config');
	StartScreen = require('./start');
	CharacterChooser = require('../character-chooser');

	this.backgroundImage = new Background('./img/background.png');
	this.infoText = new Text('Choose character', 30);
	this.infoText.color = Config.fontColor;
	this.infoText.fontType = 'FSpirit';

	this.buttons = [];

	this.backButton = new Button({
		image: './img/back_button.png',
		hoverImage: './img/back_button_hover.png',
		location: function() {
			var x = Config.progressBarPadding;
			var y = App.canvasObj.getHeight() - Config.progressBarPadding - this.getActiveImage().height;
			return new Point(x, y);
		},
	});

	this.backButton.onClick(function () {
		App.screen = new StartScreen();
		App.canvasObj.setGraphics(App.screen.graphics);
		CharacterChooser.stop();
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

	this.fadeValue = 1;
	this.playerFadeValue = 0;
	this.chosenPlayer = null;

	this.infoText.setLocation(function() {
		var x = Utilities.centerX(obj.infoText.getTextWidth());;
		var y = App.canvasObj.getHeight() * 0.15;
		return new Point(x, y);
	});

	obj = this;
};

ChooseScreen.prototype.drawButtons = function () {
	var buttons = obj.buttons;
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].drawButton();
	}
};

ChooseScreen.prototype.disposeButtons = function () {
	var buttons = obj.buttons;
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].dispose();
	}
};

ChooseScreen.prototype.setButtons = function (buttons) {
	this.buttons = buttons;
};

ChooseScreen.prototype.getButtons = function () {
	return this.buttons;
};

ChooseScreen.prototype.graphics = function() {
	var canvas = App.canvasObj.canvas;
	obj.backgroundImage.draw();
	canvas.save();
	canvas.globalAlpha = obj.fadeValue;
	if (obj.chosenPlayer === null) {
		obj.infoText.draw();
		obj.drawButtons();
		obj.backButton.drawButton();
	} else {
		obj.chosenPlayer.draw(0, 0);
	}
	canvas.globalAlpha = 1;
};

ChooseScreen.prototype.dispose = function() {
	obj.disposeButtons();
	obj.backButton.dispose();
};

module.exports = ChooseScreen;