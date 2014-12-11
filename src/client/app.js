var Canvas = require('./lib/canvas/canvas.js');
var StartScreen = require('./lib/screen/start.js');
var Player = require('./lib/player/player.js');

var App = module.exports = function() {};

App.screen = new StartScreen();
App.canvasObj = new Canvas('#window');
App.gameStarted = false;
App.player = new Player();
App.opponent = new Player();

require('./lib/global-events.js');