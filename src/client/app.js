var Canvas = require('./lib/canvas/canvas.js');
var StartScreen = require('./lib/screen/start.js');

var App = module.exports = function() {};

App.screen = new StartScreen();
App.canvasObj = new Canvas('#window');

require('./lib/global-events.js');