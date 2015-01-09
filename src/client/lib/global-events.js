var App = require('../app');
var Client = require('./client');
var EventCollection = require('./event-collection');
var Point = require('./canvas/point');
var Player = require('./player');
var StartScreen = require('./screen/start');
var CountDownScreen = require('./screen/count-down');
var SpriteSheet = require('./spritesheet');
var socket = io();

var GlobalEvents = module.exports = function() {};

$(window).keydown(function (event) {
	Client.Key.onKeydown(event);
});

$(window).keyup(function (event) {
	Client.Key.onKeyup(event);
});

$(window).click(function(event) {
  var location = new Point(event.pageX, event.pageY);
  for (var key in EventCollection.clickList) {
    if (EventCollection.clickList[key].pointIntersects(location)) {
      EventCollection.clickList[key].executeClick();
    }
  }
});

$(window).mousemove(function(event) {
  var location = new Point(event.pageX, event.pageY);
  for (var key in EventCollection.mouseOverList) {
    if (EventCollection.mouseOverList[key].pointIntersects(location)) {
      EventCollection.mouseOverList[key].executeMouseOver();
    } else {
      EventCollection.mouseOverList[key].executeMouseLeave();
    }
  }
});

socket.on('playing', function(data) {
  var playerSpriteImage = new Image();
  playerSpriteImage.src = './img/' + data.player.image;

  var opponentSpriteImage = new Image();
  opponentSpriteImage.src = './img/' + data.opponent.image;

  var getSprite = function(image) {
    return SpriteSheet({
      image: image,
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
          speed: 0.2,
          order: 'asc'
        },
        moveAnimation: {
          name: 'moveAnimation',
          startFrame: 8,
          frames: 6,
          speed: 0.2,
          order: 'desc'
        },
        jumpAnimation: {
          name: 'jumpAnimation',
          startFrame: 2,
          frames: 6,
          speed: 0.2,
          order: 'asc'
        },
        punchAnimation: {
          name: 'punchAnimation',
          startFrame: 25,
          frames: 2,
          speed: 0.2,
          order: 'asc'
        },
        defendAnimation: {
          name: 'defendAnimation',
          startFrame: 0,
          frames: 2,
          speed: 0.2,
          order: 'asc'
        }
      },
      defaultAnimation: 'standAnimation'
    });
  };

  var playerSprite = getSprite(playerSpriteImage);
  var opponentSprite = getSprite(opponentSpriteImage);

  App.player = new Player(new Point(data.player.x, data.player.y), playerSprite);
  App.opponent = new Player(new Point(data.opponent.x, data.opponent.y), opponentSprite);

  App.screen.dispose();
  App.screen = new CountDownScreen();
  App.canvasObj.setGraphics(App.screen.graphics);
});

socket.on('unactive', function() {
  App.gameStarted = false;
  Client.stop();
  App.screen.dispose();
  App.screen = new StartScreen();
  App.canvasObj.setGraphics(App.screen.graphics);
});

socket.on('update', function(data) {
  Client.storeServerData(data);
});

$(window).load(function () {
	App.canvasObj.setGraphics(App.screen.graphics);
	App.canvasObj.draw();
});