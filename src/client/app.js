var Canvas = require('./lib/canvas/canvas');
var Point = require('./lib/canvas/point');
var StartScreen = require('./lib/screen/start');
var Player = require('./lib/player');
var SpriteSheet = require('./lib/spritesheet');

var App = module.exports = function() {};

App.screen = new StartScreen();
App.canvasObj = new Canvas('#window');
App.gameStarted = false;


var playerSpriteImage = new Image();
playerSpriteImage.src = './img/spritesheet2.png';

var opponentSpriteImage = new Image();
opponentSpriteImage.src = './img/spritesheet2.png';


var playerSprite = SpriteSheet({
	image: playerSpriteImage,
	animations: {
		leftStandAnimation: {
			start: 0,
			rowY: 0,
			frames: 3,
			speed: 0.2,
			direction: 'right',
			frameHeight: 39,
			frameDimensions: [
				{x: 0, width: 29},
				{x: 29, width: 29},
				{x: 58, width: 29}
			]
		},
		rightStandAnimation: {
			start: 3,
			rowY: 0,
			frames: 3,
			speed: 0.2,
			direction: 'left',
			frameHeight: 39,
			frameDimensions: [
				{x: 0, width: 29},
				{x: 29, width: 29},
				{x: 58, width: 29}
			]
		},
		jumpAnimation: {
			start: 0,
			rowY: 39,
			frames: 16,
			speed: 0.4,
			frameHeight: 57,
			frameDimensions: [
				{x: 0, width: 32},
				{x: 32, width: 36},
				{x: 68, width: 48},
				{x: 116, width: 52},
				{x: 168, width: 44},
				{x: 212, width: 32},
				{x: 244, width: 32},
				{x: 276, width: 32},
				{x: 308, width: 32},
				{x: 340, width: 32},
				{x: 372, width: 48},
				{x: 420, width: 52},
				{x: 472, width: 48},
				{x: 520, width: 40},
				{x: 560, width: 32}
			]
		}
	},
	defaultAnimation: 'rightStandAnimation'
});

var opponentSprite = SpriteSheet({
	image: playerSpriteImage,
	animations: {
		leftStandAnimation: {
			start: 0,
			rowY: 0,
			frames: 3,
			speed: 0.2,
			direction: 'right',
			frameHeight: 39,
			frameDimensions: [
				{x: 0, width: 29},
				{x: 29, width: 29},
				{x: 58, width: 29}
			]
		},
		rightStandAnimation: {
			start: 3,
			rowY: 0,
			frames: 3,
			speed: 0.2,
			direction: 'left',
			frameHeight: 39,
			frameDimensions: [
				{x: 0, width: 29},
				{x: 29, width: 29},
				{x: 58, width: 29}
			]
		},
		jumpAnimation: {
			start: 0,
			rowY: 39,
			frames: 16,
			speed: 0.4,
			frameHeight: 57,
			frameDimensions: [
				{x: 0, width: 32},
				{x: 32, width: 36},
				{x: 68, width: 48},
				{x: 116, width: 52},
				{x: 168, width: 44},
				{x: 212, width: 32},
				{x: 244, width: 32},
				{x: 276, width: 32},
				{x: 308, width: 32},
				{x: 340, width: 32},
				{x: 372, width: 48},
				{x: 420, width: 52},
				{x: 472, width: 48},
				{x: 520, width: 40},
				{x: 560, width: 32}
			]
		}
	},
	defaultAnimation: 'rightStandAnimation'
});

App.player = new Player(new Point(-100, -100), playerSprite);
App.opponent = new Player(new Point(-100, -100), opponentSprite);

require('./lib/global-events');