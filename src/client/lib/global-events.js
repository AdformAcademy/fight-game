var App = require('../app.js');
var StartScreen = require('./screen/start.js');
var CountDownScreen = require('./screen/count-down.js');
var socket = io();

var GlobalEvents = module.exports = function() {};

GlobalEvents.Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  
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


socket.on('playing', function() {
	App.screen = new CountDownScreen();
	App.canvasObj.graphics = App.screen.graphics;
});

socket.on('unactive', function() {
	App.gameStarted = false;
	App.screen = new StartScreen();
	App.canvasObj.graphics = App.screen.graphics;
});

$(window).load(function () {
	App.canvasObj.graphics = App.screen.graphics;
	App.canvasObj.draw();
});