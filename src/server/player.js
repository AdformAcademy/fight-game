function Player(id, number, x, y){
   this.id = id;
   this.x = x;
   this.y = y;
}
Player.prototype.getID = function(){
    return this.id;
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

module.exports = Player;