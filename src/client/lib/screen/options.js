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
var InputCollection;

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
	InputCollection = require('../input-collection');

	this.waitingForInput = false;

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
			var y = App.canvasObj.getHeight() * 0.4 - (obj.Text.soundsText.getSize() + this.getActiveImage().height) / 2;
			return new Point(x, y);
		},
		activeState: state
	});

	this.buttons.backButton = new Button({
		image: './img/back_button.png',
		hoverImage: './img/back_button_hover.png',
		location: function() {
			var x = Config.progressBarPadding;
			var y = App.canvasObj.getHeight() - Config.progressBarPadding - this.getActiveImage().height;
			return new Point(x, y);
		},
	});

	this.buttons.soundsButton.onClick(function () {
		if(SoundCollection.mute) {
			SoundCollection.mute = false;
			this.setActiveImage(this.getImage(0));
		} else {
			SoundCollection.mute = true;
			this.setActiveImage(this.getImage(1));
		}
	});

	this.buttons.soundsButton.mouseOver(function () {
		if(SoundCollection.mute) {
			this.setActiveImage(this.getHoverImage(1));
		} else {
			this.setActiveImage(this.getHoverImage(0));
		}
		this.hover();
	});

	this.buttons.soundsButton.mouseLeave(function () {
		if(SoundCollection.mute) {
			this.setActiveImage(this.getImage(1));
		} else {
			this.setActiveImage(this.getImage(0));
		}
		this.hoverLeave();
	});

	this.buttons.backButton.onClick(function () {
		App.screen = new StartScreen();
		App.canvasObj.setGraphics(App.screen.graphics);
		obj.dispose();
	});

	this.buttons.backButton.mouseOver(function () {
		this.setActiveImage(this.getHoverImage());
		this.hover();
	});

	this.buttons.backButton.mouseLeave(function () {
		this.setActiveImage(this.getImage());
		this.hoverLeave();
	});

	this.keyMap = Config.keyMap;
	var layout = Config.controlsLayout;
	var tableData = Config.controlsTable;
	this.ControlChanger = {};

	var i = 0;

	for (var key in layout) {
		var tempTxt, tempBtn, tempBtnTxt;

		tempBtn = new Button({
			image: './img/control_button.png',
			hoverImage: './img/control_button_hover.png',
			location: function (ind) {
				return function () {
					var x = App.canvasObj.getWidth() * (0.5 + Math.floor(ind / 3) * tableData.columnWidth - tableData.buttonWidth);
					var y = App.canvasObj.getHeight() * (tableData.tableStart + (ind % 3) * tableData.rowHeight);
					return new Point(x, y);
				}
			}(i)
		});

		tempBtnTxt = new Text(obj.keyCodeToString(Config.keyBindings[key]), 18)
		tempBtnTxt.setColor('#cbcbcb');
		tempBtnTxt.setFontType('Arial');
		tempBtnTxt.setLocation(function (ind) {
			return function () {
				var x = App.canvasObj.getWidth() * (0.5 + Math.floor(ind / 3) * tableData.columnWidth - tableData.buttonWidth) + (tempBtn.getActiveImage().width - this.getTextWidth()) / 2;
				var y = App.canvasObj.getHeight() * (tableData.tableStart + ((ind % 3) + 0.5) * tableData.rowHeight);
				return new Point(x, y);
			}
		}(i));

		tempTxt = new Text(layout[key], 18);
		tempTxt.setColor('#cbcbcb');
		tempTxt.setFontType('Arial');
		tempTxt.setLocation(function (ind) {
			return function () {
				var x = App.canvasObj.getWidth() * (0.15 + Math.floor(ind / 3) * 0.35);
				var y = App.canvasObj.getHeight() * (tableData.tableStart + ((ind % 3) + 0.5) * tableData.rowHeight);
				return new Point(x, y);
			}
		}(i));

		tempBtn.onClick(function () {
			if(!obj.waitingForInput) {
				var button = this;
				obj.waitingForInput = true;
				var input;
				var handleInputs = setInterval (function(){
					input = InputCollection.getCurrentInput();
					if(input) {
						if(obj.keyMap[input] || (48 <= input && input <= 90)) {
							if(!obj.inputExists(input)) {
								Config.keyBindings[button.getId()] = input;
								clearInterval(blinking);
								obj.ControlChanger[button.getId()].buttonText.setText(obj.keyCodeToString(Config.keyBindings[button.getId()]));
								obj.waitingForInput = false;
								clearInterval(handleInputs);
							} else {
								obj.ControlChanger[button.getId()].buttonText.setColor('#ff5555');
								setTimeout(function () {
									obj.ControlChanger[button.getId()].buttonText.setColor('#cbcbcb');
								}, 300);
							}
						} else if (input === Config.keyBindings.ESCAPE) {
							clearInterval(blinking);
							obj.ControlChanger[button.getId()].buttonText.setText(obj.keyCodeToString(Config.keyBindings[button.getId()]));
							obj.waitingForInput = false;
							clearInterval(handleInputs);
						}
					}
				}, 1000 / 30);
				var state = 0;
				obj.ControlChanger[button.getId()].buttonText.setText('');
				var blinking = setInterval (function () {
					state++;
					state %= 2;
					if(state == 1) {
						obj.ControlChanger[button.getId()].buttonText.setText('_');
					} else {
						obj.ControlChanger[button.getId()].buttonText.setText('');
					}
				}, 200);
			}
		});
		tempBtn.mouseOver(function () {
			this.setActiveImage(this.getHoverImage());
			this.hover();
		});
		tempBtn.mouseLeave(function () {
			this.setActiveImage(this.getImage());
			this.hoverLeave();
		});

		tempBtn.setId(key);
		
		obj.ControlChanger[tempBtn.getId()] = {
			button: tempBtn,
			text: tempTxt,
			buttonText: tempBtnTxt
		};

		i++;
	}
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
		obj.ControlChanger[key].buttonText.draw();
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
		obj.ControlChanger[key].buttonText.dispose();
	}
};

OptionsScreen.prototype.keyCodeToString = function(keyCode) {
	if(48 <= keyCode && keyCode <= 90)
		return String.fromCharCode(keyCode);
	else if (obj.keyMap[keyCode] !== undefined)
		return obj.keyMap[keyCode];
};

OptionsScreen.prototype.inputExists = function(keyCode) {
	for (var key in Config.controlsLayout) {
		if(Config.keyBindings[key] === keyCode) {
			return true;
		} 
	}
	return false;
}

module.exports = OptionsScreen;