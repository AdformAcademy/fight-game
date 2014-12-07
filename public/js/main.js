var Canvas = require('./lib/canvas.js');
var Button = require('./lib/button.js');
var Location = require('./lib/location.js');

var canvasObj = new Canvas('#window');
var startButton = new Button('./img/start_button.png', canvasObj);
startButton.setHoverImage('./img/start_button_hover.png');

function graphics() {
	startButton.drawButton();
}

//load this chunk of code when all external sources was loaded
$(window).load(function () {

	startButton.onClick(function() {
	//startButton.visible = false;
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

	var imageWidth = startButton.activeImage.width / 2;
	console.log(imageWidth);
	var middle = canvasObj.width() / 2 - imageWidth;
	var yloc = canvasObj.height() * 0.4;
	console.log(middle);
	startButton.location = new Location(middle, yloc);

	canvasObj.draw(graphics);
});