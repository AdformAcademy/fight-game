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
		width: 20480,
		height: 224,
		frameWidth: 320
	},
	animations: {
		standAnimation: {
			name: 'standAnimation',
			left: {
				name: 'left',
				startFrame: 28,
				frames: 4,
				speed: 0.2
			},
			right: {
				name: 'right',
				startFrame: 32,
				frames: 4,
				speed: 0.2
			}
		},
		jumpAnimation: {
			name: 'jumpAnimation',
			left: {
				name: 'left',
				startFrame: 28,
				frames: 7,
				speed: 0.4
			},
			right: {
				name: 'right',
				startFrame: 28,
				frames: 8,
				speed: 0.4
			}
		}
	},
	defaultAnimation: {
		animation: 'standAnimation',
		direction: 'right'
	}
});

var opponentSprite = SpriteSheet({
	image: opponentSpriteImage,
	spriteDimensions: {
		width: 20480,
		height: 224,
		frameWidth: 320
	},
	animations: {
		standAnimation: {
			name: 'standAnimation',
			left: {
				name: 'left',
				startFrame: 28,
				frames: 4,
				speed: 0.2
			},
			right: {
				name: 'right',
				startFrame: 32,
				frames: 4,
				speed: 0.2
			}
		},
		jumpAnimation: {
			name: 'jumpAnimation',
			left: {
				name: 'left',
				startFrame: 28,
				frames: 8,
				speed: 0.4
			},
			right: {
				name: 'right',
				startFrame: 28,
				frames: 8,
				speed: 0.04
			}
		}
	},
	defaultAnimation: {
		animation: 'standAnimation',
		direction: 'left'
	}
});

App.player = new Player(new Point(-100, -100), playerSprite);
App.opponent = new Player(new Point(-100, -100), opponentSprite);

require('./lib/global-events');