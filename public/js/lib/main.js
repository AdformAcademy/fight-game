var canvasObj = new Canvas('#window');
var startButton = new Button('./img/start_button.png', canvasObj.canvas);

var middle = canvasObj.width() / 2;

startButton.location = new Location(middle, 200);

startButton.onClick(function() {
	startButton.visible = false;
	//alert('im click event');
});

function graphics() {
	startButton.drawButton();
}

$(document).ready(function () {
	canvasObj.draw(graphics);
});