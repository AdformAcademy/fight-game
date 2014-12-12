var socket = io();

function Player(id, opponentId, x, y){
   this.id = id;
   this.opponentId = opponentId;
   this.x = x;
   this.y = y;
}
Player.prototype.getID = function(){
    return this.id;
}
Player.prototype.getOpponentId = function(){
    return this.opponentId;
}
Player.prototype.setOpponentId = function(opponentId){
    this.opponentId = opponentId;
}
Player.prototype.getX = function(){
    return this.x;
}
Player.prototype.getY = function(){
    return this.y;
}
Player.prototype.setX = function(x){
    this.x = x;
}
Player.prototype.setY = function(y){
    this.y = y;
}
Player.KeyBindings = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

});



module.exports = Player;