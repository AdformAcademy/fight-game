var App = require('../app.js');
var StartScreen = require('./screen/start.js');
var StageScreen = require('./screen/stage.js');
var socket = io();

var GlobalEvents = module.exports = function() {};

GlobalEvents.keyBindings = {
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
	DOWN: 40
};

socket.on('playing', function() {
	App.screen = new StageScreen();
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

$(window).keydown(function (event) {
	if (App.gameStarted) {
	    if (event.keyCode == GlobalEvents.keyBindings.RIGHT) {
	    	console.log('RIGHT');
	    	socket.emit('move', GlobalEvents.keyBindings.RIGHT);
	    }
	    if (event.keyCode == GlobalEvents.keyBindings.LEFT) {
	    	console.log('LEFT');
	    	socket.emit('move', GlobalEvents.keyBindings.LEFT);
	    }
	    if (event.keyCode == GlobalEvents.keyBindings.UP) {
			console.log('UP');
			socket.emit('move', GlobalEvents.keyBindings.UP);
	    }
	    if (event.keyCode == GlobalEvents.keyBindings.DOWN) {
	    	console.log('DOWN');
	    	socket.emit('move', GlobalEvents.keyBindings.DOWN);
	    }
	}
});