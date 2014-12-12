var Canvas = require('./lib/canvas/canvas');
var StartScreen = require('./lib/screen/start');
var Player = require('./lib/player/player');

var App = module.exports = function() {};

App.screen = new StartScreen();
App.canvasObj = new Canvas('#window');
App.gameStarted = false;
App.player = new Player();
App.opponent = new Player();

require('./lib/global-events');