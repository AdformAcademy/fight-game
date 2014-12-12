var App = require('../../app');

function Utilities() {}

Utilities.centerX = function(objectWidth) {
	var halfWidth = objectWidth / 2;
	var middle = App.canvasObj.width() / 2 - halfWidth;
	return middle;
};

module.exports = Utilities;