var App = require('../app');
var InputCollection = require('./input-collection');
var Client = require('./client');
var EventCollection = require('./event-collection');
var Point = require('../../common/point');
var StartScreen = require('./screen/start');
var Stage = require('./screen/stage');
var EndScreen = require('./screen/end');
var WaitingScreen = require('./screen/waiting');
var TournamentWaitingScreen = require('./screen/tournament-waiting');
var Config = require('./config');
var CharacterChooser = require('./character-chooser');
var socket = io();
var SoundCollection = require('./sound-collection');

var GlobalEvents = {};
GlobalEvents.lastMove = null;

$(window).keydown(function (event) {
	InputCollection.onKeydown(event);
});

$(window).keyup(function (event) {
	InputCollection.onKeyup(event);
});

$(window).bind('touchstart', function(event) {
	GlobalEvents.lastMove = event;
	var x = event.originalEvent.touches[0].pageX;
	var y = event.originalEvent.touches[0].pageY;
	var location = new Point(x, y);
	for (var key in EventCollection.touchList) {
		EventCollection.touchList[key].resetTouch();
		if (EventCollection.touchList[key].pointIntersects(location)) {
	  		EventCollection.touchList[key].touchStart();
		}
	}
});

$(window).bind('touchmove', function(event) {
	GlobalEvents.lastMove = event;
});

$(window).bind('touchend', function(event) {
	var x = GlobalEvents.lastMove.originalEvent.touches[0].pageX;
	var y = GlobalEvents.lastMove.originalEvent.touches[0].pageY;
	var location = new Point(x, y);
	for (var key in EventCollection.touchList) {
		if (EventCollection.touchList[key].pointIntersects(location)) {
	  		EventCollection.touchList[key].touchEnd();
		}
		EventCollection.touchList[key].resetTouch();
	}
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
	if (!Client.gameStarted) {
		Client.initializeGame(data);
	} else {
		App.screen.dispose();
		App.screen = new WaitingScreen();
		App.canvasObj.setGraphics(App.screen.graphics);
		App.screen.load('Opponent found');
		Client.stop();
		Client.initializeGame(data);
	}
});

socket.on('choose-character', function (data) {
	CharacterChooser.createScreen(data);
	CharacterChooser.start();
});

socket.on('unactive', function() {
	if (Client.gameStarted) {
		Client.stop();
		App.screen.dispose();
		App.screen = new EndScreen('Connection lost');
		App.canvasObj.setGraphics(App.screen.graphics);
	}
});

socket.on('message', function (data) {
	if (Client.gameStarted) {
		App.screen.animateEndText(data.text, data.color);
		Client.canMove = false;
		Client.gameStarted = false;
		setTimeout(function () {
			Client.stop();
			App.screen.dispose();
			App.screen = new EndScreen(data.text, data.color);
			App.canvasObj.setGraphics(App.screen.graphics);
			SoundCollection.stopSound('common', 'theme');
		}, 5000);	
	} else {
		App.screen.dispose();
		App.screen = new EndScreen(data.text, data.color);
		App.canvasObj.setGraphics(App.screen.graphics);
		SoundCollection.stopSound('common', 'theme');
	}
});

socket.on('victory', function() {
	Client.stop();
	SoundCollection.stopSound('common', 'theme');
	App.screen.dispose();
	App.screen = new EndScreen('Victory');
	App.canvasObj.setGraphics(App.screen.graphics);
});

socket.on('defeat', function() {
	Client.stop();
	SoundCollection.stopSound('common', 'theme');
	App.screen.dispose();
	App.screen = new EndScreen('Defeat');
	App.canvasObj.setGraphics(App.screen.graphics);
});

socket.on('update', function(data) {
	Client.storeServerData(data);
});

socket.on('tournament-waiting', function (data) {
	if (!Client.gameStarted && !(App.screen instanceof TournamentWaitingScreen)) {
		App.screen.dispose();
		App.screen = new TournamentWaitingScreen();
		App.canvasObj.setGraphics(App.screen.graphics);
	}
	if (App.screen instanceof TournamentWaitingScreen) {
		App.screen.update(data);
	}
});

socket.on('tournament-progress', function (data) {
	if (Client.gameStarted) {
		App.screen.stageTimerUpdate(data);
	}
});

socket.on('tournament-end-fight', function (data) {
	if (Client.gameStarted) {
		App.screen.animateEndText(data.message);
		Client.canMove = false;
		setTimeout(function () {
			Client.stop();
			App.screen.dispose();
			App.screen = new WaitingScreen();
			App.canvasObj.setGraphics(App.screen.graphics);
		}, 5000);	
	}
});

socket.on('training', function (data) {
	if (!Client.gameStarted) {
		Client.isTraining = true;
		Client.initializeTraining(data);
	}
});

$(window).load(function () {
	App.canvasObj.setGraphics(App.screen.graphics);
	App.canvasObj.draw();

	$(window).scrollTop($('#window').offset().top);
});

module.exports = GlobalEvents;