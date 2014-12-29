var Canvas = require('./lib/canvas/canvas');
var Point = require('./lib/canvas/point');
var StartScreen = require('./lib/screen/start');
var Player = require('./lib/player');

var App = module.exports = function() {};

App.screen = new StartScreen();
App.canvasObj = new Canvas('#window');
App.gameStarted = false;
App.player = new Player();
App.player.setLocation(new Point(-100, -100));
App.opponent = new Player();
App.opponent.setLocation(new Point(-100, -100));

require('./lib/global-events');