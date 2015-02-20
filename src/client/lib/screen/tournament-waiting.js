var App;
var Utilities;
var Point;
var Text;
var Background;
var StageScreen;
var SpriteSheet = require('../canvas/spritesheet');
var Config = require('../config');
var fs = require('fs');
var socket = io();
var obj;

function TournamentWaitingScreen(data) {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Point = require('../../../common/point');
	Text = require('../canvas/text');
	Background = require('../canvas/background');
	StageScreen = require('./stage');

	this.chars = data.chars;
	this.Ids = data.ids;
	this.backgroundImage = new Background('./img/tournament_waiting.png');
	this.waitingText = new Text('Waiting for players, ' + data.pairs + '/8 ready', 30);
	this.waitingText.color = '#cbcbcb';
	this.waitingText.fontType = 'FSpirit';

	this.waitingText2 = new Text('Game will start in: ' + data.timer, 30);
	this.waitingText2.color = '#cbcbcb';
	this.waitingText2.fontType = 'FSpirit';

	this.loadingText = new Text('Loading', 30);
	this.loadingText.color = '#cbcbcb';
	this.loadingText.fontType = 'FSpirit';

	obj = this;

	this.animateInterval = null;
	this.animating = false;
	this.opponentFound = false;

	this.loadingValue = 0;
	this.dots = 0;


	this.waitingText.setLocation(function() {
		var x = Utilities.centerX(obj.waitingText.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.1;
		return new Point(x, y);
	});

	this.waitingText2.setLocation(function() {
		var x = Utilities.centerX(obj.waitingText2.getTextWidth());
		var y = App.canvasObj.getHeight() * 0.2;
		return new Point(x, y);
	});

	var centerX = Utilities.centerX(this.loadingText.getTextWidth());
	this.loadingText.setLocation(function() {
		var x = centerX;
		var y = App.canvasObj.getHeight() * 0.35;
		return new Point(x, y);
	});

	TournamentWaitingScreen.drawBrakects(this.Ids, this.chars);
};

TournamentWaitingScreen.drawBrakects = function (Ids, chars) {
	for (var i = 0; i < Ids.length; i++) {
		var spriteImage = new Image();
		spriteImage.src = chars[Ids[i] - 1];
		console.log(spriteImage.src);
	}
};

/*
CharacterChooser.createButtons = function (data) {
	CharacterChooser.data = data;
	var buttons = [];
	var startX = App.canvasObj.getWidth() * 0.125;
	var startY = App.canvasObj.getHeight() * 0.2;
	var width = 228;
	var height = 160;
	var shiftX = 0;
	var shiftY = 0;
	var margin = 3;
	var buttonsInRow = 3;
	var currentButton = 0;
	var currentRow = 0;

	for (var character in data) {
		var x = startX + shiftX + (margin * currentButton);
		var y = startY + shiftY + (margin * currentRow);
		var spriteImage = new Image();
		spriteImage.src = './img/characters/' 
			+ data[character].spriteSheetButton.spriteSheetIntroImage;
		var button = new Button({
			id: data[character].id,
			useSpriteSheet: true,
			spriteSheet: new SpriteSheet({
				image: spriteImage,
				data: data[character].spriteSheetButton,
				useScale: true,
				scaleWidth: width,
				scaleHeight: height
			}),
			location: new Point(x, y),
			drawBorder: true,
			borderWidth: 3,
			borderColor: '#5E5E5E',
			width: width,
			height: height
		});

		button.mouseOver(function() {
			var oldActiveButton = CharacterChooser.activeButton;
			CharacterChooser.activeButton = this.id - 1;
			if (oldActiveButton !== CharacterChooser.activeButton) {
				CharacterChooser.resetUnactiveButton(oldActiveButton);
			}
		});

		button.onClick(function() {
			var btn = CharacterChooser.buttons[CharacterChooser.activeButton];
			var id = btn.getId();
			for (var i = 0; i < CharacterChooser.buttons.length; i++) {
				EventCollection.removeOnClickObject(CharacterChooser.buttons[i]);
				EventCollection.removeMouseOverObject(CharacterChooser.buttons[i]);
			}
			CharacterChooser.choose(id);
		})

		EventCollection.addMouseOverObject(button);
		EventCollection.addOnClickObject(button);
		buttons.push(button);

		shiftX += width;
		currentButton++;
		if (currentButton + 1 > buttonsInRow) {
			currentButton = 0;
			currentRow++;
			shiftX = 0;
			shiftY += height;
		}
	}
	return buttons;
};
*/

TournamentWaitingScreen.prototype.animateLoading = function() {
	var self = this;
	this.animateLoadingInterval = setInterval(function () {
		var dots = [];
		self.loadingValue += 0.07;
		if (self.loadingValue > 1) {
			self.loadingValue = 0;
			self.dots++;
			if (self.dots > 3) {
				self.dots = 0;
			}
		}
		for (var i = 0; i < self.dots; i++) {
			dots.push('.');
		}
		self.loadingText.setText('Loading' + dots.join(''));
	}, 1000 / 30);
};

TournamentWaitingScreen.prototype.load = function () {
	this.opponentFound = true;
	this.animating = false;
	this.waitingText.setText('Opponent found');
	clearInterval(this.animateInterval);
	this.animateLoading();
};

TournamentWaitingScreen.prototype.graphics = function() {
	obj.backgroundImage.draw();
	obj.waitingText.draw();
	obj.waitingText2.draw();
	if (obj.opponentFound) {
		obj.loadingText.draw();
	}
};

TournamentWaitingScreen.prototype.dispose = function() {
	App.canvasObj.canvas.restore();
	this.animating = false;
	clearInterval(this.animateInterval);
	clearInterval(this.animateLoadingInterval);
};

module.exports = TournamentWaitingScreen;