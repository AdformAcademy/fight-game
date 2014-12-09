var Utilities = require('../canvas/utilities.js');

var Button = require('../canvas/button.js');
var Point = require('../canvas/point.js');
var Text = require('../canvas/text.js');
var WaitingScreen = require('./waiting.js');
var Background = require('../canvas/background.js');

var socket = io();

var obj;

function StartScreen(canvasObj) {
	this.canvasObj = canvasObj;
	this.backgroundImage = new Background('./img/waiting_screen_background.png', 
		canvasObj);
	this.startButton = new Button('./img/start_button.png', canvasObj);
	this.startButton.setHoverImage('./img/start_button_hover.png');
	this.startText = new Text(canvasObj, 'Are you ready to begin a fight?', 30);
	this.startText.color = '#cbcbcb';
	this.startText.fontType = 'Arial';
	obj = this;

	this.startButton.location = function() {
		var x = Utilities.centerX(obj.canvasObj, obj.startButton.activeImage.width);
		var y = obj.canvasObj.height() * 0.4;
		return new Point(x, y);
	};

	this.startText.location = function() {
		var x = Utilities.centerX(obj.canvasObj, obj.startText.textWidth());
		var y = obj.canvasObj.height() * 0.2;
		return new Point(x, y);
	};

	this.startButton.onClick(function() {
		socket.emit('ready', '');
		var waitingScreen = new WaitingScreen(obj.canvasObj);
		obj.canvasObj.graphics = waitingScreen.graphics;
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