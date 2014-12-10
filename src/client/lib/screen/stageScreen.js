var Point = require('../canvas/point.js');
var Background = require('../canvas/background.js');
var Square = require('../canvas/square.js');
var socket = io();
var obj;

function StageScreen (canvasObj)
{
	this.canvasObj = canvasObj;
	this.backgroundImage = new Background('./img/stage_background.png', this.canvasObj);
	obj = this;

	this.player = new Square(this.canvasObj, new Point(0,0));
	this.opponent = new Square(this.canvasObj, new Point(50,50));

	socket.on('unactive', function() {
		alert('Player disconnected');
	});
}

StageScreen.prototype.graphics = function()
{
	obj.backgroundImage.draw();
	obj.player.draw();
	obj.opponent.draw();
}

module.exports = StageScreen;






