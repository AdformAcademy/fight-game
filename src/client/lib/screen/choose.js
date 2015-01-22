var App;
var Utilities;
var Button;
var Point;
var Text;
var ChooseScreen;
var Background;
var socket = io();
var obj;

var ChooseScreen = function () {
	App = require('../../app');
	Utilities = require('../canvas/utilities');
	Point = require('../../../common/point');
	Text = require('../canvas/text');
	Background = require('../canvas/background');	

	this.backgroundImage = new Background('./img/waiting_screen_background.png');
	obj = this;
};

ChooseScreen.prototype.graphics = function() {
	obj.backgroundImage.draw();
};

ChooseScreen.prototype.dispose = function() {
};

module.exports = ChooseScreen;