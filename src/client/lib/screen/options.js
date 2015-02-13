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

	this.Text = {};
	this.buttons = {};

	this.backgroundImage = new Background('./img/waiting_screen_background.png');

	this.Text.titleText = new Text('Options', 30);
	this.Text.titleText.setColor('#cbcbcb');
	this.Text.titleText.setFontType('Arial');

	this.Text.soundsText = new Text('Sounds:', 24);
	this.Text.soundsText.setColor('#cbcbcb');
	this.Text.soundsText.setFontType('Arial');

	this.Text.controlsText = new Text('Controls:', 24);
	this.Text.controlsText.setColor('#cbcbcb');
	this.Text.controlsText.setFontType('Arial');

	this.keyMap = Config.keyMap;

	obj = this;

	this.Text.soundsText.setLocation(function() {
		var x = App.canvasObj.getWidth() * 0.3;
		var y = App.canvasObj.getHeight() * 0.4;
		return new Point(x, y);
	});

	this.Text.titleText.setLocation(function() {
		var x = Utilities.centerX(obj.Text.titleText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.2;
		return new Point(x, y);
	});

	this.Text.controlsText.setLocation(function() {
		var x = App.canvasObj.getWidth() * 0.3;
		var y = App.canvasObj.getHeight() * 0.5;
		return new Point(x, y);
	});

	var state;

	if(SoundCollection.mute)
		state = 1;
	else
		state = 0;

	this.buttons.soundsButton = new SwitchButton ({
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
			var x = App.canvasObj.getWidth() * 0.7 - obj.buttons.soundsButton.getActiveImage().width;
			var y = App.canvasObj.getHeight() * 0.4 - (obj.Text.soundsText.getSize() + obj.buttons.soundsButton.getActiveImage().height) / 2;
			return new Point(x, y);
		},
		activeState: state
	});

	this.buttons.backButton = new Button({
		image: './img/back_button.png',
		hoverImage: './img/back_button_hover.png',
		location: function() {
			var x = Config.progressBarPadding;
			var y = App.canvasObj.getHeight() - Config.progressBarPadding - obj.buttons.backButton.getActiveImage().height;
			return new Point(x, y);
		},
	});

	var layout = Config.controlsLayout;
	this.ControlChanger = [];

	var tempTxt, tempBtn;
	var i = 0;

	/*for (var key in layout) {

		console.log(key + ' ' + layout[key]);

		tempBtn = new Button({
			image: './img/control_button.png',
			hoverImage: './img/control_button_hover.png',
			location: function () {
				var x = App.canvasObj.getWidth() * 0.7 - tempBtn.getActiveImage().width;
				var y = App.canvasObj.getHeight() * 0.6 + i * tempBtn.getActiveImage().height;
				return new Point(x, y);
			}
		});

		tempBtn.setText(new Text(obj.keyCodeToString(Config.keyBindings[key])));

		tempTxt = new Text(layout[key], 24);
		tempTxt.setColor('#cbcbcb');
		tempTxt.setFontType('Arial');
		tempTxt.setLocation(function () {
			var x = App.canvasObj.getWidth() * 0.3;
			var y = App.canvasObj.getHeigth() * 0.6 + i * tempBtn.activeImage.height + tempTxt.getSize();
			return new Point(x, y);
		});

		tempBtn.onClick(function () {

		});
		tempBtn.mouseOver(function () {
			tempBtn.setActiveImage(tempBtn.getHoverImage());
			tempBtn.hover();
		});
		tempBtn.mouseLeave(function () {
			tempBtn.setActiveImage(tempBtn.getImage());
			tempBtn.hoverLeave();
		});

		this.ControlChanger.push({
			button: tempBtn,
			text: tempTxt
		});

		i++;
	}*/

	this.buttons.soundsButton.onClick(function () {
		if(SoundCollection.mute) {
			SoundCollection.mute = false;
			obj.buttons.soundsButton.setActiveImage(obj.buttons.soundsButton.getImage(0));
		} else {
			SoundCollection.mute = true;
			obj.buttons.soundsButton.setActiveImage(obj.buttons.soundsButton.getImage(1));
		}
	});

	this.buttons.soundsButton.mouseOver(function () {
		if(SoundCollection.mute) {
			obj.buttons.soundsButton.setActiveImage(obj.buttons.soundsButton.getHoverImage(1));
		} else {
			obj.buttons.soundsButton.setActiveImage(obj.buttons.soundsButton.getHoverImage(0));
		}
		obj.buttons.soundsButton.hover();
	});

	this.buttons.soundsButton.mouseLeave(function () {
		if(SoundCollection.mute) {
			obj.buttons.soundsButton.setActiveImage(obj.buttons.soundsButton.getImage(1));
		} else {
			obj.buttons.soundsButton.setActiveImage(obj.buttons.soundsButton.getImage(0));
		}
		obj.buttons.soundsButton.hoverLeave();
	});

	this.buttons.backButton.onClick(function () {
		socket.emit('options', '');
		App.screen = new StartScreen();
		App.canvasObj.setGraphics(App.screen.graphics);
		obj.dispose();
	});

	this.buttons.backButton.mouseOver(function () {
		obj.buttons.backButton.setActiveImage(obj.buttons.backButton.getHoverImage());
		obj.buttons.backButton.hover();
	});

	this.buttons.backButton.mouseLeave(function () {
		obj.buttons.backButton.setActiveImage(obj.buttons.backButton.getImage());
		obj.buttons.backButton.hoverLeave();
	});
};

OptionsScreen.prototype.graphics = function () {
	obj.backgroundImage.draw();
	for (var key in obj.buttons) {
		obj.buttons[key].drawButton();
	}
	for (var key in obj.Text) {
		obj.Text[key].draw();
	}
	for (var key in obj.ControlChanger) {
		obj.ControlChanger[key].button.drawButton();
		obj.ControlChanger[key].text.draw();
	}
};

OptionsScreen.prototype.dispose = function () {
	for (var key in obj.buttons) {
		obj.buttons[key].dispose();
	}
	for (var key in obj.Text) {
		obj.Text[key].dispose();
	}
	for (var key in obj.ControlChanger) {
		obj.ControlChanger[key].button.dispose();
		obj.ControlChanger[key].text.dispose();
	}
};

OptionsScreen.prototype.keyCodeToString = function(keyCode) {
	if(48 <= keyCode && keyCode <= 90)
		return String.fromCharCode(keyCode);
	else if (obj.keyMap[event.keyCode] !== undefined)
		return obj.keyMap[event.keyCode];
};

module.exports = OptionsScreen;