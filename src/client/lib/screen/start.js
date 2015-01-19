var App;
var Utilities;
var Button;
var Point;
var Text;
var WaitingScreen;
var Background;
var socket = io();
var obj;

function StartScreen() {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Button = require('../canvas/button');
	Point = require('../../../common/point');
	Text = require('../canvas/text');
	WaitingScreen = require('./waiting');
	Background = require('../canvas/background');	

	this.backgroundImage = new Background('./img/waiting_screen_background.png');
	this.startButton = new Button('./img/start_button.png');
	this.startButton.setHoverImage('./img/start_button_hover.png');
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
		socket.emit('ready', '');
		App.screen = new WaitingScreen();
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

StartScreen.prototype.graphics = function() {
	obj.backgroundImage.draw();
	obj.startButton.drawButton();
	obj.startText.draw();
};

StartScreen.prototype.dispose = function() {
	this.startButton.dispose();
	this.startText.dispose();
};

module.exports = StartScreen;