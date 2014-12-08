function Utilities() {}

Utilities.centerX = function(canvasObj, objectWidth) {
	var halfWidth = objectWidth / 2;
	var middle = canvasObj.width() / 2 - halfWidth;
	return middle;
};

module.exports = Utilities;