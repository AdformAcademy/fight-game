var App = require('../app');
var EventCollection = require('./event-collection');
var Point = require('./canvas/point');
var StartScreen = require('./screen/start');
var CountDownScreen = require('./screen/count-down');
var socket = io();

var GlobalEvents = module.exports = function() {};

GlobalEvents.Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  UP_LEFT: 41,
  UP_RIGHT: 42,
  DOWN_LEFT: 43,
  DOWN_RIGHT: 44,
  SPACE: 32,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

$(window).keydown(function (event) {
	GlobalEvents.Key.onKeydown(event);
});

$(window).keyup(function (event) {
	GlobalEvents.Key.onKeyup(event);
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

socket.on('playing', function() {
	App.screen = new CountDownScreen();
	App.canvasObj.setGraphics(App.screen.graphics);
});

socket.on('unactive', function() {
	App.gameStarted = false;
	App.screen = new StartScreen();
	App.canvasObj.setGraphics(App.screen.graphics);
});

socket.on('update', function(data) {
  console.log('socket update receive');
  App.player.setLocation(new Point(data.player.x, data.player.y));
  App.player.setZ(data.player.z);
  App.opponent.setLocation(new Point(data.opponent.x, data.opponent.y));
  App.opponent.setZ(data.opponent.z);
});

$(window).load(function () {
	App.canvasObj.setGraphics(App.screen.graphics);
	App.canvasObj.draw();
});