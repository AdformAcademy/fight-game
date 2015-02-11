var App;
var SoundCollection;
var Button;
var SwitchButton;
var Point;
var Text;
var socket = io();
var obj;
var Background;
var Config;
var Utilities;
var StartScreen;

function OptionsScreen () {
	App = require('../../app');
	SoundCollection = require('../sound-collection');
	Button = require('../canvas/button');
	SwitchButton = require('../canvas/switch-button');
	Point = require('../../../common/point');
	Text = require('../canvas/text');
	Background = require('../canvas/background');
	Config = require('../config');
	Utilities = require('../canvas/utilities');
	StartScreen = require('./start');

	this.backgroundImage = new Background('./img/waiting_screen_background.png');
	this.titleText = new Text('Options', 30);
	this.titleText.setColor('#cbcbcb');
	this.titleText.setFontType('Arial');

	this.soundsText = new Text('Sounds:', 24);
	this.soundsText.setColor('#cbcbcb');
	this.soundsText.setFontType('Arial');

	obj = this;

	this.soundsText.setLocation(function() {
		var x = App.canvasObj.getWidth() * 0.3;
		var y = App.canvasObj.getHeight() * 0.5;
		return new Point(x, y);
	});

	this.titleText.setLocation(function() {
		var x = Utilities.centerX(obj.titleText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.2;
		return new Point(x, y);
	});

	var state;
	if(SoundCollection.mute)
		state = 1;
	else
		state = 0;

	this.soundsButton = new SwitchButton ({
		images: [
		{
			normal: './img/sound_button.png',
			hover: './img/sound_button_hover.png'
		},
		{
			normal: './img/mute_button.png',
			hover: './img/mute_button_hover.png'
		}],		
		location: function() {
			var x = App.canvasObj.getWidth() * 0.7 - obj.soundsButton.getActiveImage().width;
			var y = App.canvasObj.getHeight() * 0.5 - (obj.soundsText.getSize() + obj.soundsButton.getActiveImage().height) / 2;
			return new Point(x, y);
		},
		activeState: state
	});

	this.backButton = new Button({
		image: './img/back_button.png',
		hoverImage: './img/back_button_hover.png',
		location: function() {
			var x = Config.progressBarPadding;
			var y = App.canvasObj.getHeight() - Config.progressBarPadding - obj.backButton.getActiveImage().height;
			return new Point(x, y);
		}
	});

	this.soundsButton.onClick(function () {
		if(SoundCollection.mute) {
			SoundCollection.mute = false;
			obj.soundsButton.setActiveImage(obj.soundsButton.getImage(0));
		} else {
			SoundCollection.mute = true;
			obj.soundsButton.setActiveImage(obj.soundsButton.getImage(1));
		}
	});

	this.soundsButton.mouseOver(function () {
		if(SoundCollection.mute) {
			obj.soundsButton.setActiveImage(obj.soundsButton.getHoverImage(1));
		} else {
			obj.soundsButton.setActiveImage(obj.soundsButton.getHoverImage(0));
		}
		obj.soundsButton.hover();
	});

	this.soundsButton.mouseLeave(function () {
		if(SoundCollection.mute) {
			obj.soundsButton.setActiveImage(obj.soundsButton.getImage(1));
		} else {
			obj.soundsButton.setActiveImage(obj.soundsButton.getImage(0));
		}
		obj.soundsButton.hoverLeave();
	});

	this.backButton.onClick(function () {
		socket.emit('options', '');
		App.screen = new StartScreen();
		App.canvasObj.setGraphics(App.screen.graphics);
		obj.dispose();
	});

	this.backButton.mouseOver(function () {
		obj.backButton.setActiveImage(obj.backButton.getHoverImage());
		obj.backButton.hover();
	});

	this.backButton.mouseLeave(function () {
		obj.backButton.setActiveImage(obj.backButton.getImage());
		obj.backButton.hoverLeave();
	});
}

OptionsScreen.prototype.graphics = function () {
	obj.backgroundImage.draw();
	obj.soundsButton.drawButton();
	obj.titleText.draw();
	obj.soundsText.draw();
	obj.backButton.drawButton();
}

OptionsScreen.prototype.dispose = function () {
	obj.soundsButton.dispose();
	obj.soundsText.dispose();
	obj.titleText.dispose();
	obj.backButton.dispose();
}

module.exports = OptionsScreen;