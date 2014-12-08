var Canvas = require('./lib/canvas/canvas.js');
var Utilities = require('./lib/canvas/utilities.js');

var Button = require('./lib/canvas/button.js');
var Point = require('./lib/canvas/point.js');
var Text = require('./lib/canvas/text.js');

var canvasObj = new Canvas('#window');
var startButton = new Button('./img/start_button.png', canvasObj);
startButton.setHoverImage('./img/start_button_hover.png');
var startText = new Text(canvasObj,
	'Are you ready to begin a fight?',
	30);

startText.color = '#cbcbcb';
startText.fontType = 'Arial';

startButton.location = function() {
	var x = Utilities.centerX(canvasObj, startButton.activeImage.width);
	var y = canvasObj.height() * 0.4;
	return new Point(x, y);
}

startText.location = function() {
	var x = Utilities.centerX(canvasObj, startText.textWidth());
	var y = canvasObj.height() * 0.2;
	return new Point(x, y);
}

startButton.onClick(function() {
	//TODO add waiting other player event
});

startButton.mouseOver(function() {
	startButton.activeImage = startButton.hoverImage;
	$('body').css('cursor', 'pointer');
	console.log('mouse over');
});

startButton.mouseLeave(function() {
	startButton.activeImage = startButton.image;
	$('body').css('cursor', 'default');
	console.log('mouse leave');
});

function graphics() {
	startButton.drawButton();
	startText.draw();
}

//load this chunk of code when all external sources was loaded
$(window).load(function () {
	canvasObj.draw(graphics);
});