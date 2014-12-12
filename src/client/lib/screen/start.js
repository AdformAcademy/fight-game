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
	App = require('../../app.js');
	Utilities = require('../canvas/utilities.js');
	Button = require('../canvas/button.js');
	Point = require('../canvas/point.js');
	Text = require('../canvas/text.js');
	WaitingScreen = require('./waiting.js');
	Background = require('../canvas/background.js');

	this.backgroundImage = new Background('./img/waiting_screen_background.png');
	this.startButton = new Button('./img/start_button.png');
	this.startButton.setHoverImage('./img/start_button_hover.png');
	this.startText = new Text('Are you ready to begin a fight?', 30);
	this.startText.color = '#cbcbcb';
	this.startText.fontType = 'Arial';
	obj = this;

	this.startButton.location = function() {
		var x = Utilities.centerX(obj.startButton.activeImage.width);
		var y = App.canvasObj.height() * 0.4;
		return new Point(x, y);
	};

	this.startText.location = function() {
		var x = Utilities.centerX(obj.startText.textWidth());
		var y = App.canvasObj.height() * 0.2;
		return new Point(x, y);
	};

	this.startButton.onClick(function() {
		socket.emit('ready', '');
		var waitingScreen = new WaitingScreen();
		App.canvasObj.graphics = waitingScreen.graphics;
		obj.dispose();
	});

	this.startButton.mouseOver(function() {
		obj.startButton.activeImage = obj.startButton.hoverImage;
		obj.startButton.hover();
	});

	this.startButton.mouseLeave(function() {
		obj.startButton.activeImage = obj.startButton.image;
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
}

module.exports = StartScreen;