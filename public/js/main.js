require('./lib/connection.js');
var Canvas = require('./lib/canvas/canvas.js');
var canvasObj = new Canvas('#window');
var StartScreen = require('./lib/screen/start.js');
var startScreen = new StartScreen(canvasObj);

//load this chunk of code when all external sources was loaded
$(window).load(function () {
	canvasObj.graphics = startScreen.graphics;
	canvasObj.draw();
});