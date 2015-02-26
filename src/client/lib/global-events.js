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

var GlobalEvents = {};

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
	Client.initializeGame(data);
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
		setTimeout(function () {
			Client.stop();
			App.screen.dispose();
			App.screen = new EndScreen(data.text, data.color);
			App.canvasObj.setGraphics(App.screen.graphics);
		}, 5000);	
	} else {
		App.screen.dispose();
		App.screen = new EndScreen(data.text, data.color);
		App.canvasObj.setGraphics(App.screen.graphics);
	}
});

socket.on('victory', function() {
	Client.stop();
	App.screen.dispose();
	App.screen = new EndScreen('Victory');
	App.canvasObj.setGraphics(App.screen.graphics);
});

socket.on('defeat', function() {
	Client.stop();
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

$(window).load(function () {
	App.canvasObj.setGraphics(App.screen.graphics);
	App.canvasObj.draw();
});

module.exports = GlobalEvents;