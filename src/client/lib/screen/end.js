var App;
var Utilities;
var Button;
var Point;
var Text;
var ChooseWaitingScreen;
var Background;
var socket = io();
var obj;

function EndScreen(status) {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Button = require('../canvas/button');
	Point = require('../../../common/point');
	Text = require('../canvas/text');
	ChooseWaitingScreen = require('./choose-waiting');
	Background = require('../canvas/background');	

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
	this.endText = new Text(status + '!', 50);
	if(status == "Victory")
		this.endText.setColor('#00C800');
	else
		this.endText.setColor('#C80000');
	this.endText.setFontType('Arial');
	this.challengeText = new Text('Would you like to try again?', 30);
	this.challengeText.setColor('#cbcbcb');
	this.challengeText.setFontType('Arial');
	
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

EndScreen.prototype.graphics = function() {
	obj.backgroundImage.draw();
	obj.startButton.drawButton();
	obj.endText.draw();
	obj.challengeText.draw();
};

EndScreen.prototype.dispose = function() {
	this.startButton.dispose();
	this.endText.dispose();
	this.challengeText.dispose();
};

module.exports = EndScreen;