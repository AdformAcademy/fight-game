var canvasObj = $('#window')[0];
var canvas = canvasObj.getContext('2d');
var w;
var h;
var x = 0;
var y = 0;

$(document).ready(function () {
	draw();
});

function clearCanvas() {
	canvas.clearRect(0, 0, canvasObj.width, canvasObj.height);
}

function draw() {
	updateCanvasDimensions();
	clearCanvas();
	drawBackground();
	drawRect(x, y);
	setTimeout(draw, 1000/30);
}

function drawRect(x, y) {
	canvas.fillStyle = '#FF0000';
	canvas.fillRect(x,y,150,75);
}

function drawBackground() {
	canvas.fillStyle = '#000000';
	canvas.fillRect(0,0,w,h);
}

function updateCanvasDimensions() {
	w = $(window).width();
	h = $(window).height();
	$("#window").css("width", w + "px");
	$("#window").css("height", h + "px"); 
}