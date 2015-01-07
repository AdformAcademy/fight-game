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
playerSpriteImage.src = './img/player1.png';

var opponentSpriteImage = new Image();
opponentSpriteImage.src = './img/player2.png';


var playerSprite = SpriteSheet({
	image: playerSpriteImage,
	spriteDimensions: {
		width: 10240,
		height: 224,
		frameWidth: 320
	},
	animations: {
		standAnimation: {
			name: 'standAnimation',
			startFrame: 28,
			frames: 4,
			speed: 0.2
		},
		moveAnimation: {
			name: 'moveAnimation',
			startFrame: 8,
			frames: 6,
			speed: 0.2
		},
		jumpAnimation: {
			name: 'jumpAnimation',
			startFrame: 2,
			frames: 6,
			speed: 0.2
		}
	},
	defaultAnimation: 'standAnimation'
});

var opponentSprite = SpriteSheet({
	image: opponentSpriteImage,
	spriteDimensions: {
		width: 10240,
		height: 224,
		frameWidth: 320
	},
	animations: {
		standAnimation: {
			name: 'standAnimation',
			startFrame: 28,
			frames: 4,
			speed: 0.2
		},
		moveAnimation: {
			name: 'moveAnimation',
			startFrame: 8,
			frames: 6,
			speed: 0.2
		},
		jumpAnimation: {
			name: 'jumpAnimation',
			startFrame: 2,
			frames: 6,
			speed: 0.2
		}
	},
	defaultAnimation: 'standAnimation'
});

App.player = new Player(new Point(-5000, -5000), playerSprite);
App.opponent = new Player(new Point(-5000, -5000), opponentSprite);

require('./lib/global-events');