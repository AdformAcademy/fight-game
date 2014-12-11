var App = require('../app.js');
var StartScreen = require('./screen/start.js');
var StageScreen = require('./screen/stage.js');
var socket = io();

var GlobalEvents = module.exports = function() {};

socket.on('playing', function() {
	App.screen = new StageScreen();
	App.canvasObj.graphics = App.screen.graphics;
});

socket.on('unactive', function() {
	App.screen = new StartScreen();
	App.canvasObj.graphics = App.screen.graphics;
});

$(window).load(function () {
	App.canvasObj.graphics = App.screen.graphics;
	App.canvasObj.draw();
});

/*

Juda tik vienas
Reikia padaryti, kad judetu abu, ir butu atskiri control'ai

$(window).keydown(function (event) {
            var LEFT = 37;
            var RIGHT = 39;
            var UP = 38;
            var DOWN = 40;
            if (event.keyCode == RIGHT) {
              obj.location.x = obj.location.x + 10;
            }
            if (event.keyCode == LEFT) {
              obj.location.x = obj.location.x - 10;
            }
            if (event.keyCode == UP) {
              obj.location.y = obj.location.y - 10;
            }
            if (event.keyCode == DOWN) {
              obj.location.y = obj.location.y + 10;
            }
          });
*/