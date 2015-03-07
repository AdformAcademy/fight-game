var Canvas = require('./lib/canvas/canvas');
var StartScreen = require('./lib/screen/start');
var App = module.exports = {};

App.screen = new StartScreen();
App.canvasObj = new Canvas('#window');
App.player = null;
App.opponent = null;
App.physics = null;

App.isTouchDevice = function () {
	return Modernizr.touch;
};

require('./lib/global-events');