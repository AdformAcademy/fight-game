var Canvas = require('./lib/canvas/canvas');
var Point = require('../common/point');
var StartScreen = require('./lib/screen/start');
var Player = require('./lib/player');
var SpriteSheet = require('./lib/spritesheet');

var App = module.exports = {};

App.screen = new StartScreen();
App.canvasObj = new Canvas('#window');
App.gameStarted = false;
App.player = null;
App.opponent = null;

require('./lib/global-events');