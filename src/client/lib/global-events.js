var App = require('../app');
var InputCollection = require('./input-collection');
var InputProcessor = require('./input-processor');
var Client = require('./client');
var EventCollection = require('./event-collection');
var Point = require('./canvas/point');
var Player = require('./player');
var StartScreen = require('./screen/start');
var CountDownScreen = require('./screen/count-down');
var SpriteSheet = require('./spritesheet');
var WorldPhysics = require('./world-physics');
var socket = io();

var GlobalEvents = module.exports = function() {};

$(window).keydown(function (event) {
	InputCollection.onKeydown(event);
});

$(window).keyup(function (event) {
	InputCollection.onKeyup(event);
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

  var playerSpriteData = data.player.data;
  var opponentSpriteData = data.opponent.data;
  var playerSpriteImage = new Image();
  playerSpriteImage.src = './img/' + playerSpriteData.spriteSheetImage;

  var opponentSpriteImage = new Image();
  opponentSpriteImage.src = './img/' + opponentSpriteData.spriteSheetImage;

  var buildSprite = function(image, spriteSheetData) {
    return SpriteSheet({
      image: image,
      data: spriteSheetData,
      frames: 1,
    });
  };

  var playerSprite = buildSprite(playerSpriteImage, playerSpriteData);
  var opponentSprite = buildSprite(opponentSpriteImage, opponentSpriteData);

  App.player = new Player(new Point(data.player.x, data.player.y), playerSprite);
  App.opponent = new Player(new Point(data.opponent.x, data.opponent.y), opponentSprite);

  Client.physics = new WorldPhysics({
    player: App.player,
    opponent: App.opponent
  });

  Client.inputProcessor = new InputProcessor({
    player: App.player,
    opponent: App.opponent
  });

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