var Point = require('./point.js');

function Square(canvasObj, location) {
	this.location = location;
	this.canvasObj = canvasObj;
	obj = this;

};

/*

Juda tik vienas
Reikia padaryti, kad judetu abu, ir butu atskiri control'ai

$(window).keydown(function (event) {
            var LEFT = 37;
            var RIGHT = 39;
            var UP = 38;
            var DOWN = 40;
            if (event.keyCode == RIGHT) {
              obj.location.x = obj.location.x + 10;
            }
            if (event.keyCode == LEFT) {
              obj.location.x = obj.location.x - 10;
            }
            if (event.keyCode == UP) {
              obj.location.y = obj.location.y - 10;
            }
            if (event.keyCode == DOWN) {
              obj.location.y = obj.location.y + 10;
            }
          });
*/
Square.prototype.draw = function() {
	this.canvasObj.canvas.fillStyle = '#ff0000';
	this.canvasObj.canvas.fillRect(this.location.x,this.location.y,30,30);
};



module.exports = Square;